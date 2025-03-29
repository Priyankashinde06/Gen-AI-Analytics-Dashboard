import { Provider } from 'react-redux';
import { store } from './store/store';
import { QueryInput } from './query/QueryInput';
import { ResultsView } from './query/ResultsView';
import { QueryHistory } from './query/QueryHistory';

function App() {
  return (
    <Provider store={store}>
      <div className="min-h-screen bg-gradient-to-b from-[#D9AFD9] to-[#97D9E1]">
        <header className="text-center shadow-sm">
          <div className="mx-auto py-4 px-4 sm:px-6 lg:px-8 max-w-7xl">
            <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              Gen AI Analytics Dashboard
            </h1>
          </div>
        </header>
        <main className="mx-auto py-6 px-4 sm:px-6 lg:px-8 max-w-7xl ">
          <div className="flex flex-col lg:flex-row gap-6 mt-[-12px]">
            {/* Main content area - appears first on mobile */}
            <div className="flex-1 space-y-4 order-1 lg:order-none">
              <QueryInput />
              <ResultsView className="h-7" />
            </div>

            {/* Sidebar - appears second on mobile */}
            <div className="w-full lg:w-92 xl:w-96 order-2 lg:order-none">
              <QueryHistory />
            </div>
          </div>
        </main>
      </div>
    </Provider>
  );
}

export default App;