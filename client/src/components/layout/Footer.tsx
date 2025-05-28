export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">RisparmiApp</h3>
            <p className="text-gray-600">
              L&apos;app che ti aiuta a risparmiare sulla spesa, trovando le migliori offerte nei supermercati che
              frequenti.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Link utili</h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-gray-600 hover:text-primary-600">
                  Home
                </a>
              </li>
              <li>
                <a href="/offers" className="text-gray-600 hover:text-primary-600">
                  Offerte
                </a>
              </li>
              <li>
                <a href="/register" className="text-gray-600 hover:text-primary-600">
                  Registrati
                </a>
              </li>
              <li>
                <a href="/login" className="text-gray-600 hover:text-primary-600">
                  Accedi
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Contatti</h3>
            <p className="text-gray-600">
              Per informazioni o supporto, contattaci all&apos;indirizzo email: info@risparmiapp.it
            </p>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 text-center text-gray-600">
          <p>&copy; {new Date().getFullYear()} RisparmiApp. Tutti i diritti riservati.</p>
        </div>
      </div>
    </footer>
  )
}
