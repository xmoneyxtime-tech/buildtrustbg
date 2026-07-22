import { Prisma, PaymentProviderEventStatus, PaymentStatus, SubscriptionStatus } from "@prisma/client";
import { DashboardShell } from "@/app/components/ui";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type BillingSnapshot = {
  subscriptions: Prisma.SubscriptionGetPayload<{
    include: {
      company: {
        select: { companyName: true };
      };
    };
  }>[];
  payments: Prisma.PaymentGetPayload<{
    include: {
      company: {
        select: { companyName: true };
      };
    };
  }>[];
  invoices: Prisma.InvoiceGetPayload<{
    include: {
      company: {
        select: { companyName: true };
      };
    };
  }>[];
  events: Prisma.PaymentProviderEventGetPayload<{
    include: {
      company: {
        select: { companyName: true };
      };
    };
  }>[];
  degraded: boolean;
};

function formatAmount(amountMinor: number, currency: string): string {
  return new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency,
  }).format(amountMinor / 100);
}

function formatDate(value: Date | null | undefined): string {
  if (!value) {
    return "-";
  }

  return new Intl.DateTimeFormat("bg-BG", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(value);
}

export default async function AdminBillingPage() {
  const { subscriptions, payments, invoices, events, degraded } = await getBillingSnapshot();

  const failedEvents = events.filter((event) => event.status === PaymentProviderEventStatus.FAILED);
  const failedPayments = payments.filter((payment) => payment.status === PaymentStatus.FAILED);
  const activeSubscriptions = subscriptions.filter((subscription) => subscription.status === SubscriptionStatus.ACTIVE);

  return (
    <DashboardShell role="admin">
      <div className="space-y-8">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <div className="rounded-[20px] border border-slate-200 bg-white p-5">
            <p className="text-sm text-slate-500">Active subscriptions</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">{activeSubscriptions.length}</p>
          </div>
          <div className="rounded-[20px] border border-slate-200 bg-white p-5">
            <p className="text-sm text-slate-500">Payments tracked</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">{payments.length}</p>
          </div>
          <div className="rounded-[20px] border border-slate-200 bg-white p-5">
            <p className="text-sm text-slate-500">Invoices stored</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">{invoices.length}</p>
          </div>
          <div className="rounded-[20px] border border-slate-200 bg-white p-5">
            <p className="text-sm text-slate-500">Stripe events</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">{events.length}</p>
          </div>
          <div className="rounded-[20px] border border-rose-200 bg-rose-50 p-5">
            <p className="text-sm text-rose-700">Failures</p>
            <p className="mt-2 text-3xl font-semibold text-rose-900">{failedPayments.length + failedEvents.length}</p>
          </div>
        </div>

        <section className="rounded-[24px] border border-slate-200 bg-white p-6">
          <h2 className="text-xl font-semibold text-slate-900">Subscriptions</h2>
          {degraded ? (
            <p className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              Billing tables are not available yet in this environment. Showing empty state until migrations are applied.
            </p>
          ) : null}
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead>
                <tr className="text-left text-slate-500">
                  <th className="py-3 pr-4 font-medium">Company</th>
                  <th className="py-3 pr-4 font-medium">Plan</th>
                  <th className="py-3 pr-4 font-medium">Interval</th>
                  <th className="py-3 pr-4 font-medium">Status</th>
                  <th className="py-3 pr-4 font-medium">Renewal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {subscriptions.map((subscription) => (
                  <tr key={subscription.id}>
                    <td className="py-3 pr-4 text-slate-900">{subscription.company.companyName}</td>
                    <td className="py-3 pr-4">{subscription.planName}</td>
                    <td className="py-3 pr-4">{subscription.billingInterval}</td>
                    <td className="py-3 pr-4">{subscription.status}</td>
                    <td className="py-3 pr-4">{formatDate(subscription.currentPeriodEnd)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-2">
          <div className="rounded-[24px] border border-slate-200 bg-white p-6">
            <h2 className="text-xl font-semibold text-slate-900">Payments</h2>
            <div className="mt-4 space-y-3">
              {payments.map((payment) => (
                <div key={payment.id} className="rounded-2xl border border-slate-100 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold text-slate-900">{payment.company.companyName}</p>
                      <p className="mt-1 text-sm text-slate-600">{formatAmount(payment.amountMinor, payment.currency)}</p>
                    </div>
                    <div className="text-right text-sm text-slate-600">
                      <p>{payment.status}</p>
                      <p className="mt-1">{formatDate(payment.paidAt ?? payment.failedAt ?? payment.createdAt)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[24px] border border-slate-200 bg-white p-6">
            <h2 className="text-xl font-semibold text-slate-900">Invoices</h2>
            <div className="mt-4 space-y-3">
              {invoices.map((invoice) => (
                <div key={invoice.id} className="rounded-2xl border border-slate-100 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold text-slate-900">{invoice.company.companyName}</p>
                      <p className="mt-1 text-sm text-slate-600">{invoice.number}</p>
                    </div>
                    <div className="text-right text-sm text-slate-600">
                      <p>{formatAmount(invoice.totalMinor, invoice.currency)}</p>
                      <p className="mt-1">{invoice.status}</p>
                    </div>
                  </div>
                  {invoice.pdfUrl ? (
                    <a href={invoice.pdfUrl} target="_blank" rel="noreferrer" className="mt-3 inline-flex text-sm font-medium text-[#0F4C81] hover:underline">
                      Open PDF
                    </a>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-[24px] border border-slate-200 bg-white p-6">
          <h2 className="text-xl font-semibold text-slate-900">Stripe Events & Failures</h2>
          <div className="mt-4 space-y-3">
            {events.map((event) => (
              <div key={event.id} className={`rounded-2xl border p-4 ${event.status === PaymentProviderEventStatus.FAILED ? "border-rose-200 bg-rose-50" : "border-slate-100"}`}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold text-slate-900">{event.eventType}</p>
                    <p className="mt-1 text-sm text-slate-600">{event.company?.companyName ?? "No company resolved"}</p>
                  </div>
                  <div className="text-right text-sm text-slate-600">
                    <p>{event.status}</p>
                    <p className="mt-1">{formatDate(event.receivedAt)}</p>
                  </div>
                </div>
                {event.errorMessage ? <p className="mt-3 text-sm text-rose-700">{event.errorMessage}</p> : null}
              </div>
            ))}
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}

async function getBillingSnapshot(): Promise<BillingSnapshot> {
  try {
    const [subscriptions, payments, invoices, events] = await Promise.all([
      prisma.subscription.findMany({
        orderBy: { updatedAt: "desc" },
        take: 12,
        include: {
          company: {
            select: { companyName: true },
          },
        },
      }),
      prisma.payment.findMany({
        orderBy: { updatedAt: "desc" },
        take: 12,
        include: {
          company: {
            select: { companyName: true },
          },
        },
      }),
      prisma.invoice.findMany({
        orderBy: { updatedAt: "desc" },
        take: 12,
        include: {
          company: {
            select: { companyName: true },
          },
        },
      }),
      prisma.paymentProviderEvent.findMany({
        where: {
          provider: "STRIPE",
        },
        orderBy: { receivedAt: "desc" },
        take: 20,
        include: {
          company: {
            select: { companyName: true },
          },
        },
      }),
    ]);

    return {
      subscriptions,
      payments,
      invoices,
      events,
      degraded: false,
    };
  } catch (error) {
    logBillingDataError(error);

    return {
      subscriptions: [],
      payments: [],
      invoices: [],
      events: [],
      degraded: true,
    };
  }
}

function logBillingDataError(error: unknown): void {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    const tableMissing = error.code === "P2021";
    console.error("[billing] prisma query failed", {
      code: error.code,
      tableMissing,
      model: error.meta?.modelName,
    });
    return;
  }

  if (error instanceof Error) {
    console.error("[billing] unexpected data error", { message: error.message });
    return;
  }

  console.error("[billing] unknown data error");
}