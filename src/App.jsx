import { Provider } from 'react-redux';
import { store } from './store/store';
import { QueryInput } from './features/query/QueryInput';
import { ResultsView } from './features/query/ResultsView';
import { QueryHistory } from './features/query/QueryHistory';

function App() {
  return (
    <Provider store={store}>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm">
          <div className="mx-auto py-4 px-4 sm:px-6 lg:px-8 max-w-7xl">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              Gen AI Analytics Dashboard
            </h1>
          </div>
        </header>
        <main className="mx-auto py-6 px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Main content area - appears first on mobile */}
            <div className="flex-1 space-y-6 order-1 lg:order-none">
              <QueryInput />
              <ResultsView />
            </div>
            
            {/* Sidebar - appears second on mobile */}
            <div className="w-full lg:w-80 xl:w-96 order-2 lg:order-none">
              <QueryHistory />
            </div>
          </div>
        </main>
      </div>
    </Provider>
  );
}

export default App;