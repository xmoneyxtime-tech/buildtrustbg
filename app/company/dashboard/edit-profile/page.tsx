import { DashboardShell, Panel } from "@/app/components/ui";

export default function EditProfilePage() {
  return (
    <DashboardShell
      role="company"
      title="Edit Profile"
      subtitle="Редактирайте основни данни за компанията, адрес, град и контакти."
    >
      <Panel title="Основни данни" description="Формата ще бъде внедрена след добавяне на backend логика.">
        <div className="space-y-3 text-sm leading-7 text-slate-700">
          <p>• Company Name</p>
          <p>• Description</p>
          <p>• Phone</p>
          <p>• Email</p>
          <p>• Website</p>
          <p>• Address</p>
          <p>• City</p>
          <p>• Working Hours</p>
        </div>
      </Panel>
    </DashboardShell>
  );
}
