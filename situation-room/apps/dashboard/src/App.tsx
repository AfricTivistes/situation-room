import { Refine } from "@refinedev/core";
import routerBindings from "@refinedev/react-router-v6";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { noCodBDataProvider } from "./providers/dataProvider.nocodb";
import { resources } from "../refine.config";

function App() {
  return (
    <BrowserRouter>
      <Refine
        routerProvider={routerBindings}
        dataProvider={noCodBDataProvider}
        resources={resources}
      >
        <Routes>
          {/* Page d'accueil du dashboard */}
          <Route
            path="/"
            element={
              <div style={{ padding: "2rem" }}>
                <h1>🛡️ Situation Room – Africa ElectionLab</h1>
                <p>Le dashboard est en cours de construction.</p>
                <p>
                  Consulte <code>SKILLS_MAP.md</code> pour trouver comment
                  contribuer !
                </p>
              </div>
            }
          />
          {/* Liste des signalements – À enrichir lors du hackathon */}
          <Route
            path="/reports"
            element={
              <div style={{ padding: "2rem" }}>
                <h2>📋 Liste des signalements</h2>
                <p>
                  TODO : Implémenter la liste avec <code>useTable</code> de
                  Refine.js
                </p>
              </div>
            }
          />
        </Routes>
      </Refine>
    </BrowserRouter>
  );
}

export default App;
