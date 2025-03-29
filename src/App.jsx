
import { Provider } from 'react-redux';
import { store } from './store/store';
import { QueryInput } from './query/QueryInput';
import { ResultsView } from './query/ResultsView';
import { QueryHistory } from './query/QueryHistory';

function App() {
  return (
    <Provider store={store}>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-bold text-gray-900">
              Gen AI Analytics Dashboard
            </h1>
          </div>
        </header>
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3 space-y-6">
              <QueryInput />
              <ResultsView />
            </div>
            <div className="lg:col-span-1">
              <QueryHistory />
            </div>
          </div>
        </main>
      </div>
    </Provider>
  );
}

export default App;