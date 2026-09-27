interface Props {
  title: string;
}

export function PlaceholderPage({ title }: Props) {
  return (
    <div className="flex h-64 flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 text-center">
      <p className="text-lg font-medium text-gray-700">{title}</p>
      <p className="mt-1 text-sm text-gray-400">
        Fitur ini akan tersedia di fase pengembangan berikutnya.
      </p>
    </div>
  );
}
