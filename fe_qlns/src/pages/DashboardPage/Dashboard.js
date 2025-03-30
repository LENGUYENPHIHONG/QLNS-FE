// src/pages/Dashboard.js
import React from 'react';
import { Grid, Typography } from '@mui/material';
import InfoCard from '../../components/InfoCard/infocard.js';
import PeopleIcon from '@mui/icons-material/People';
import AssignmentIcon from '@mui/icons-material/Assignment';
import BusinessIcon from '@mui/icons-material/Business';
import BarChart from '../../components/Chart/barchart.js';
import PieChart from '../../components/Chart/piechart.js';
import LineChart from '../../components/Chart/linechart.js';

const Dashboard = () => {
  // Giả sử dữ liệu được lấy từ API hoặc state
  const totalEmployees = 1000;
  const totalContracts = 45;
  const totalDepartments = 10;

  return (
    <div style={{ padding: '10px' }}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <InfoCard
            title="Tổng số nhân viên"
            value={totalEmployees}
            icon={<PeopleIcon />}
            color="#3399FF"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <InfoCard
            title="Số hợp đồng"
            value={totalContracts}
            icon={<AssignmentIcon />}
            color="#00CC33"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <InfoCard
            title="Số phòng ban"
            value={totalDepartments}
            icon={<BusinessIcon />}
            color="#FF3333"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <InfoCard
            title="Hợp đồng sắp hết hạn"
            value={totalDepartments}
            icon={<AssignmentIcon />}
            color="#FFCC33"
          />
        </Grid>
      </Grid>
      <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
         <LineChart />
         <PieChart />
      </div>
      
    </div>
    
  );
};

export default Dashboard;