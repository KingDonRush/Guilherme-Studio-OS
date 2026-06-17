import { HashRouter, Route, Routes } from "react-router-dom";
import { useStudioData } from "../api/use-studio-data.js";
import { Sidebar, Topbar } from "../components/layout.js";
import { Agents } from "../views/agents.js";
import { Career } from "../views/career.js";
import { Control } from "../views/control.js";
import { Crm } from "../views/crm.js";
import { Delivery } from "../views/delivery.js";
import { Economy } from "../views/economy.js";
import { Finance } from "../views/finance.js";
import { PortfolioMarketing } from "../views/portfolio-marketing.js";
import { Products } from "../views/products.js";

export function App() {
  const data = useStudioData();

  return (
    <HashRouter>
      <main className="shell">
        <Sidebar />
        <section className="content">
          <Topbar data={data} />
          <Routes>
            <Route path="/" element={<Economy data={data} />} />
            <Route path="/crm" element={<Crm data={data} />} />
            <Route path="/delivery" element={<Delivery data={data} />} />
            <Route path="/products" element={<Products data={data} />} />
            <Route path="/portfolio" element={<PortfolioMarketing data={data} />} />
            <Route path="/career" element={<Career data={data} />} />
            <Route path="/finance" element={<Finance data={data} />} />
            <Route path="/agents" element={<Agents data={data} />} />
            <Route path="/control" element={<Control data={data} />} />
          </Routes>
        </section>
      </main>
    </HashRouter>
  );
}
