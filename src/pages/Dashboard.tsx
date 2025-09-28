import React from 'react';
import { motion } from 'framer-motion';
import { useDashboardStore } from '../stores/dashboardStore';
import type { Lead } from '../types/dashboard';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import SidebarFilters from '../components/dashboard/SidebarFilters';
import KpiTile from '../components/dashboard/KpiTile';
import TimeSeriesCard from '../components/dashboard/TimeSeriesCard';
import ChannelBarCard from '../components/dashboard/ChannelBarCard';
import FunnelStrip from '../components/dashboard/FunnelStrip';
import LeadsTable from '../components/dashboard/LeadsTable';
import LeadDrawer from '../components/dashboard/LeadDrawer';
import TopFaqs from '../components/dashboard/TopFaqs';
import RecentTranscripts from '../components/dashboard/RecentTranscripts';
import Alerts from '../components/dashboard/Alerts';

const Dashboard: React.FC = () => {
  const { 
    kpis, 
    timeSeries, 
    channelPerf, 
    leads, 
    faqs, 
    transcripts, 
    alerts, 
    funnelSteps,
    selectedLead,
    setSelectedLead 
  } = useDashboardStore();


  const handleLeadClick = (lead: Lead) => {
    setSelectedLead(lead);
  };

  const handleCloseDrawer = () => {
    setSelectedLead(null);
  };

  // Generate sparkline data for KPIs
  const generateSparkline = (baseValue: number, variance: number = 0.2) => {
    return Array.from({ length: 7 }, () => {
      const variation = (Math.random() - 0.5) * variance;
      return Math.max(0, baseValue * (1 + variation));
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <SidebarFilters />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <DashboardHeader />
        
        {/* Content */}
        <main className="flex-1 p-6">
          {/* KPI Tiles */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8"
          >
            <KpiTile
              title="Leads"
              value={kpis.leads}
              delta={kpis.deltas.leads}
              sparkline={generateSparkline(kpis.leads, 0.3)}
              format="number"
            />
            <KpiTile
              title="Qualified"
              value={kpis.qualifiedPct}
              delta={kpis.deltas.qualifiedPct}
              sparkline={generateSparkline(kpis.qualifiedPct, 0.1)}
              format="percentage"
            />
            <KpiTile
              title="Bookings"
              value={kpis.bookings}
              delta={kpis.deltas.bookings}
              sparkline={generateSparkline(kpis.bookings, 0.4)}
              format="number"
            />
            <KpiTile
              title="Speed to Reply"
              value={kpis.speedToFirstReplyMedianSec}
              delta={kpis.deltas.speedToFirstReplyMedianSec}
              sparkline={generateSparkline(kpis.speedToFirstReplyMedianSec, 0.2)}
              format="time"
            />
            <KpiTile
              title="Show Rate"
              value={kpis.showRatePct}
              delta={kpis.deltas.showRatePct}
              sparkline={generateSparkline(kpis.showRatePct, 0.1)}
              format="percentage"
            />
            <KpiTile
              title="Est. Revenue"
              value={kpis.estRevenue}
              delta={kpis.deltas.estRevenue}
              sparkline={generateSparkline(kpis.estRevenue, 0.3)}
              format="currency"
            />
          </motion.div>

          {/* Charts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
          >
            <TimeSeriesCard data={timeSeries} />
            <ChannelBarCard data={channelPerf} />
          </motion.div>

          {/* Funnel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            className="mb-8"
          >
            <FunnelStrip steps={funnelSteps} />
          </motion.div>

          {/* Leads Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.3 }}
            className="mb-8"
          >
            <LeadsTable data={leads} onRowClick={handleLeadClick} />
          </motion.div>

          {/* Bottom Row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            <TopFaqs faqs={faqs} />
            <RecentTranscripts transcripts={transcripts} />
            <Alerts alerts={alerts} />
          </motion.div>
        </main>
      </div>

      {/* Lead Drawer */}
      <LeadDrawer 
        lead={selectedLead} 
        isOpen={!!selectedLead} 
        onClose={handleCloseDrawer} 
      />
    </div>
  );
};

export default Dashboard;