import Link from "next/link";
import { AppShell, Panel, StatusBadge } from "@/app/components/ui";
import { TrustScoreCard } from "@/app/components/trust";
import {
  AIReviewSummaryCard,
  AIKeywordCloud,
  AIInsightCard,
  AIRecommendationCard,
  ReviewFlagsCard,
  ReviewStatistics,
} from "@/app/components/ai-review";
import { companyProfilePlaceholder } from "@/app/lib/mock-data";
import { generateMockTrustScore } from "@/app/lib/mock-trust-scores";
import { analyzeBatch } from "@/app/lib/ai-review";

// Sample reviews for demonstration
const DEMO_REVIEWS = [
  "Excellent communication throughout the project. The team was professional and delivered quality work on time. Highly recommended!",
  "Great professionalism and attention to detail. They finished ahead of schedule and kept us updated regularly.",
  "Very satisfied with the quality of workmanship. The team was courteous and took care to minimize disruption.",
  "Good service overall, but there were minor delays in the final phase. Communication was responsive.",
  "Professional team that delivered great results. Fair pricing and reliable work quality.",
];

export default function CompanyProfilePage() {
  // Generate sample trust score for demo (use placeholder company name for consistent results)
  const trustScore = generateMockTrustScore("1");

  // Perform batch analysis on demo reviews
  const batchAnalysis = analyzeBatch(DEMO_REVIEWS);

  // Calculate sentiment percentages
  const distribution = batchAnalysis.sentimentDistribution;
  const total =
    distribution.very_positive +
    distribution.positive +
    distribution.neutral +
    distribution.negative +
    distribution.very_negative;
  const positivePercent = total > 0 ? ((distribution.very_positive + distribution.positive) / total) * 100 : 0;
  const neutralPercent = total > 0 ? (distribution.neutral / total) * 100 : 0;
  const negativePercent = total > 0 ? ((distribution.negative + distribution.very_negative) / total) * 100 : 0;

  // Generate AI recommendation text
  const recommendationText =
    batchAnalysis.averageQuality === "high"
      ? "На основата на отзивите от клиенти, качеството на работата и верификационния статус, препоръчвам силно тази компания за строителни проекти."
      : batchAnalysis.averageQuality === "medium"
        ? "Тази компания има смесени отзиви, но поддържа приемливите стандарти на качество. Подходяща за проекти с надлежен контрол."
        : "Тази компания има тревожни отзиви. Проявете внимание и проверете всички условия преди ангажиране.";
  return (
    <AppShell>
      <section className="mx-auto max-w-7xl px-6 py-10 sm:px-8 lg:px-10 lg:py-16">
        <div className="rounded-[32px] border border-slate-200/80 bg-white/90 p-8 shadow-[0_24px_80px_-32px_rgba(15,76,129,0.2)] sm:p-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#F58220]">Профил на компания</p>
              {companyProfilePlaceholder.name ? (
                <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                  {companyProfilePlaceholder.name}
                </h1>
              ) : (
                <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm text-slate-600">Профилът на компанията е на обновяване. Компанийните данни ще бъдат добавени скоро.</p>
                </div>
              )}
            </div>
            <StatusBadge variant="info">Проверено от BuildTrustBG</StatusBadge>
          </div>

          {/* Trust Score Section */}
          <div className="mt-8">
            <TrustScoreCard result={trustScore} title="Коефициент на доверие" />
          </div>

          {/* AI Review Intelligence Section */}
          <div className="mt-8 space-y-6">
            <h2 className="text-2xl font-semibold text-slate-900">AI анализ на отзивите</h2>

            {/* AI Summary */}
            <AIReviewSummaryCard summary={batchAnalysis.insights[0]?.description || "Анализирам отзивите на клиентите, за да предоставя интелигентни прозрения за производителността на компанията."} />

            {/* Review Statistics */}
            <ReviewStatistics
              positivePercent={positivePercent}
              neutralPercent={neutralPercent}
              negativePercent={negativePercent}
            />

            {/* Keywords */}
            {batchAnalysis.insights.length > 0 && (
              <AIKeywordCloud keywords={batchAnalysis.insights.slice(0, 5).map((insight) => insight.title)} />
            )}

            {/* Insights Grid */}
            {batchAnalysis.insights.length > 0 && (
              <div>
                <h3 className="mb-4 text-lg font-semibold text-slate-900">Основни изводи</h3>
                <div className="grid gap-4 lg:grid-cols-2">
                  {batchAnalysis.insights.map((insight, index) => (
                    <AIInsightCard key={index} insight={insight} />
                  ))}
                </div>
              </div>
            )}

            {/* Flags Card */}
            {batchAnalysis.commonFlags.length > 0 && (
              <ReviewFlagsCard
                flags={batchAnalysis.commonFlags.map((flagType) => ({
                  type: flagType,
                  description: `Quality flag detected: ${flagType}`,
                  severity: "low" as const,
                  confidence: "medium" as const,
                }))}
              />
            )}

            {/* Recommendation */}
            <AIRecommendationCard
              recommendation={recommendationText}
              overallQuality={batchAnalysis.averageQuality}
            />
          </div>

          {/* Company Details */}
          <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <Panel title="Описание" description="Шаблон за нов профил">
              <p className="text-sm leading-8 text-slate-700">{companyProfilePlaceholder.description}</p>
            </Panel>
            <Panel title="Контакти" description="Управлирано от компанията">
              <div className="space-y-3 text-sm leading-7 text-slate-700">
                <p>Телефон: {companyProfilePlaceholder.phone}</p>
                <p>Email: {companyProfilePlaceholder.email}</p>
                <p>Website: {companyProfilePlaceholder.website}</p>
                <p>Град: {companyProfilePlaceholder.city}</p>
                <p>Адрес: {companyProfilePlaceholder.address}</p>
              </div>
            </Panel>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <Panel title="Услуги" description="Управлирано от компанията">
              <div className="flex flex-wrap gap-3">
                {companyProfilePlaceholder.services.map((service) => (
                  <span key={service} className="rounded-full border border-slate-200 bg-[#F8FAFC] px-3 py-2 text-sm font-medium text-slate-700">
                    {service}
                  </span>
                ))}
              </div>
            </Panel>
            <Panel title="Работно време" description="Управлирано от компанията">
              <p className="text-sm leading-7 text-slate-700">{companyProfilePlaceholder.workingHours}</p>
            </Panel>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <Panel title="Проекти" description="Завършени проекти и реализирани обекти.">
              <ul className="space-y-2 text-sm leading-7 text-slate-700">
                {companyProfilePlaceholder.projectNotes.map((project) => (
                  <li key={project}>• {project}</li>
                ))}
              </ul>
            </Panel>
            <Panel title="Галерия" description="Снимки и визуална презентация на работата.">
              <ul className="space-y-2 text-sm leading-7 text-slate-700">
                {companyProfilePlaceholder.galleryItems.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </Panel>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <Panel title="Отзиви" description="Публични мнения от клиенти и партньори.">
              <ul className="space-y-2 text-sm leading-7 text-slate-700">
                {companyProfilePlaceholder.reviews.map((review) => (
                  <li key={review}>• {review}</li>
                ))}
              </ul>
            </Panel>
            <Panel title="Социални мрежи" description="Връзки за контакт и проверка на компанията.">
              <div className="space-y-3 text-sm leading-7 text-slate-700">
                <p>Facebook: {companyProfilePlaceholder.facebook}</p>
                <p>Instagram: {companyProfilePlaceholder.instagram}</p>
                <p>LinkedIn: {companyProfilePlaceholder.linkedin}</p>
              </div>
            </Panel>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/contact" className="rounded-full bg-[#F58220] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#E36F00]">
              Контактирай фирмата
            </Link>
            <Link href="/companies" className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-[#F8FAFC]">
              Обратно към компаниите
            </Link>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
