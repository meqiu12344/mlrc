export default function PaymentCancel() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-white to-amber-50 px-4">
      <div className="bg-white/90 border border-rose-100 shadow-2xl rounded-3xl p-8 max-w-lg w-full text-center">
        <div className="text-3xl mb-3">🛑</div>
        <h1 className="text-xl font-bold text-gray-900 mb-2">Płatność przerwana</h1>
        <p className="text-gray-600">Możesz wrócić do raportu i spróbować ponownie.</p>
      </div>
    </main>
  );
}
