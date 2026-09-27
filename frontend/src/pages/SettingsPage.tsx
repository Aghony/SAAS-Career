import { useAuth } from "../hooks/useAuth";

export function SettingsPage() {
  const { user } = useAuth();
  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-gray-900">Settings</h1>
      <div className="max-w-md rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="mb-4 font-medium text-gray-900">Profil</h2>
        <div className="space-y-3 text-sm">
          <div>
            <p className="text-gray-500">Nama</p>
            <p className="text-gray-900">{user?.name}</p>
          </div>
          <div>
            <p className="text-gray-500">Email</p>
            <p className="text-gray-900">{user?.email}</p>
          </div>
          <div>
            <p className="text-gray-500">Bergabung sejak</p>
            <p className="text-gray-900">
              {user?.createdAt
                ? new Date(user.createdAt).toLocaleDateString("id-ID")
                : "-"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
