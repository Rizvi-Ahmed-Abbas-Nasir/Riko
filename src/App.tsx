import { useState, useEffect, useRef } from 'react';
import LandingPage from './components/LandingPage';
import ChatInterface from './components/ChatInterface';

function App() {
  const [hasStartedChat, setHasStartedChat] = useState(false);

  return (
    <div className="min-h-screen w-full overflow-hidden">
      {!hasStartedChat ? (
        <LandingPage  />
      ) : (
        <ChatInterface />
      )}
    </div>
  );
}



export default App;
