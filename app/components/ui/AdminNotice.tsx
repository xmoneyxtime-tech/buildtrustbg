export function AdminNotice() {
  return (
    <div className="rounded-[16px] border-l-4 border-red-500 bg-red-50 p-4">
      <div className="flex items-start gap-3">
        <div className="text-2xl">🔒</div>
        <div>
          <p className="font-semibold text-red-900">Административна зона</p>
          <p className="mt-1 text-sm text-red-800">
            Административният панел е защитена зона. След активиране на вход и роли достъпът ще бъде разрешен само за Super Admin, Admin и Moderator.
          </p>
        </div>
      </div>
    </div>
  );
}
