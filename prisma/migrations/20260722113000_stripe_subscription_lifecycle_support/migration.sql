ALTER TABLE "Subscription"
ADD COLUMN "providerSubscriptionId" TEXT;

CREATE UNIQUE INDEX "Subscription_providerSubscriptionId_key"
ON "Subscription"("providerSubscriptionId");

ALTER TABLE "Invoice"
ADD COLUMN "providerInvoiceId" TEXT,
ADD COLUMN "pdfUrl" TEXT;

CREATE UNIQUE INDEX "Invoice_providerInvoiceId_key"
ON "Invoice"("providerInvoiceId");