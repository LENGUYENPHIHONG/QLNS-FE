// src/pages/ExampleDashboard.js
import React, { useState, useEffect } from 'react';
import {
  Grid,
  Typography,
  Box,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@mui/material';
import InfoCard from '../../components/InfoCard/infocard';
import PeopleIcon from '@mui/icons-material/People';
import { Pie } from 'react-chartjs-2';
import { Bar, Line } from 'react-chartjs-2';
import { Layout } from 'antd';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement
} from 'chart.js';
import {
  getEmployeeOverview,
  getContractStatistics,
  getLeaveStatistics,
  getDepartmentStatistics
} from '../../api/DashboardApi';
 
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement
);

const Dashboard = () => {
  const today = new Date();
  const currentYear = today.getFullYear();
  const years = Array.from({ length: 6 }, (_, i) => currentYear - i); // last 6 years

  // Filter states
  const [ovYear, setOvYear] = useState(currentYear);
  const [ovMonth, setOvMonth] = useState(today.getMonth() + 1);
  const [ovCompare, setOvCompare] = useState('');

  const [ctYear, setCtYear] = useState(currentYear);
  const [ctMonth, setCtMonth] = useState(today.getMonth() + 1);
  const [ctCompare, setCtCompare] = useState('');

  const [lvYear, setLvYear] = useState(currentYear);
  const [lvMonth, setLvMonth] = useState(today.getMonth() + 1);
  const [lvCompare, setLvCompare] = useState('');

  const [dpYear, setDpYear] = useState(currentYear);
  const [dpMonth, setDpMonth] = useState(today.getMonth() + 1);
  const [dpCompare, setDpCompare] = useState('');

  // Data states
  const [overview, setOverview] = useState({ DangLam: 0, ThuViec: 0, DaNghi: 0, GioiTinh: [], LoaiNhanVien: [] });
  const [contractStats, setContractStats] = useState({ DangHieuLuc: 0, SapHetHan: 0, DaKetThuc: 0, GiaHan: 0 });
  const [leaveStats, setLeaveStats] = useState({ TongDon: 0, ChoDuyet: 0, DaDuyet: 0, TuChoi: 0 });
  const [deptStats, setDeptStats] = useState([]);

  useEffect(() => {
    fetchOverview();
    fetchContract();
    fetchLeave();
    fetchDept();
  }, []);

  // Fetch functions
  const fetchOverview = () => {
    getEmployeeOverview(ovYear, ovMonth, ovCompare)
      .then(res => setOverview(res.data.current))
      .catch(console.error);
  };
  const fetchContract = () => {
    getContractStatistics(ctYear, ctMonth, ctCompare)
      .then(res => setContractStats(res.data.current))
      .catch(console.error);
  };
  const fetchLeave = () => {
    getLeaveStatistics(lvYear, lvMonth, lvCompare)
      .then(res => setLeaveStats(res.data.current))
      .catch(console.error);
  };
  const fetchDept = () => {
    getDepartmentStatistics(dpYear, dpMonth, dpCompare)
      .then(res => setDeptStats(res.data.current))
      .catch(console.error);
  };

  // Reusable filter row with larger text
  const renderFilter = (year, month, compare, setYear, setMonth, setCompare, onApply) => (
    <Box display="flex" flexWrap="wrap" alignItems="center" gap={2} mb={2}>
      <FormControl size="small" sx={{ width: 120 }}>
        <InputLabel sx={{ fontSize: '1.8rem' }}>Năm</InputLabel>
        <Select
          value={year}
          label="Năm"
          onChange={e => setYear(Number(e.target.value))}
          sx={{ fontSize: '1.8rem' }}
        >
          {years.map(y => (
            <MenuItem key={y} value={y} sx={{ fontSize: '1.5rem' }}>{y}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl size="small" sx={{ width: 100 }}>
        <InputLabel sx={{ fontSize: '1.8rem' }}>Tháng</InputLabel>
        <Select
          value={month}
          label="Tháng"
          onChange={e => setMonth(Number(e.target.value))}
          sx={{ fontSize: '1.8rem' }}
        >
          {[...Array(12)].map((_, i) => (
            <MenuItem key={i+1} value={i+1} sx={{ fontSize: '1.5rem' }}>{i+1}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button variant="contained" size="small" onClick={onApply} sx={{ fontSize: '1.8rem' }}>Áp dụng</Button>
    </Box>
  );

  const chartOptions = { maintainAspectRatio: false, responsive: true };

  return (
    <Layout style={{ background: '#fff' }}>
    <Box p={4}>
      <Typography variant="h4" sx={{ fontSize: '2rem', mb: 2 }}>Tổng quan Nhân sự</Typography>
      {renderFilter(ovYear, ovMonth, ovCompare, setOvYear, setOvMonth, setOvCompare, fetchOverview)}
      <Grid container spacing={3} mb={2}>
        <Grid item xs={12} sm={4}><InfoCard title="Đang làm việc" value={overview.DangLam} icon={<PeopleIcon />} color="#4caf50"/></Grid>
        <Grid item xs={12} sm={4}><InfoCard title="Thử việc" value={overview.ThuViec} icon={<PeopleIcon />} color="#2196f3"/></Grid>
        <Grid item xs={12} sm={4}><InfoCard title="Đã nghỉ" value={overview.DaNghi} icon={<PeopleIcon />} color="#f44336"/></Grid>
      </Grid>
      <Grid container spacing={2} mb={4}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: 300 }}>
            <Typography sx={{ fontWeight: 600, fontSize: '1.2rem' }}>Giới tính</Typography>
            <Box sx={{ height: 240 }}>
              <Pie
                data={{
                  labels: overview.GioiTinh.map(g => g.GioiTinh),
                  datasets: [{
                    data: overview.GioiTinh.map(g => g.SoLuong),
                    backgroundColor: ['#3f51b5', '#4caf50', '#f44336', '#ff9800']
                  }]
                }}
                options={chartOptions}
              />
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: 300 }}>
            <Typography sx={{ fontWeight: 600, fontSize: '1.2rem' }}>Loại nhân viên</Typography>
            <Box sx={{ height: 240 }}>
              <Bar
                data={{
                  labels: overview.LoaiNhanVien.map(l => l.Loai),
                  datasets: [{
                    label: 'Số NV',
                    data: overview.LoaiNhanVien.map(l => l.SoLuong),
                    backgroundColor: '#1976d2'
                  }]
                }}
                options={chartOptions}
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Divider sx={{ my: 4 }} />
      <Typography variant="h4" sx={{ fontSize: '2rem', mb: 2 }}>Thống kê Hợp đồng</Typography>
      {renderFilter(ctYear, ctMonth, ctCompare, setCtYear, setCtMonth, setCtCompare, fetchContract)}
      <Paper sx={{ p: 2, height: 340, mb: 4 }}>
        <Typography sx={{ fontWeight: 600, fontSize: '1.2rem' }}>Hợp đồng</Typography>
        <Box sx={{ height: 280 }}>
          <Bar
            data={{
              labels: ['Hiệu lực', 'Sắp hết hạn', 'Đã kết thúc', 'Gia hạn'],
              datasets: [{
                label: 'Số lượng',
                data: [contractStats.DangHieuLuc, contractStats.SapHetHan, contractStats.DaKetThuc, contractStats.GiaHan],
                backgroundColor: '#00897b'
              }]
            }}
            options={chartOptions}
          />
        </Box>
      </Paper>

      <Divider sx={{ my: 4 }} />
      <Typography variant="h4" sx={{ fontSize: '2rem', mb: 2 }}>Thống kê Nghỉ phép</Typography>
      {renderFilter(lvYear, lvMonth, lvCompare, setLvYear, setLvMonth, setLvCompare, fetchLeave)}
      <Paper sx={{ p: 2, height: 340, mb: 4 }}>
        <Typography sx={{ fontWeight: 600, fontSize: '1.2rem' }}>Nghỉ phép</Typography>
        <Box sx={{ height: 280 }}>
          <Line
            data={{
              labels: ['Tổng', 'Chờ duyệt', 'Đã duyệt', 'Từ chối'],
              datasets: [{
                label: 'Số đơn',
                data: [leaveStats.TongDon, leaveStats.ChoDuyet, leaveStats.DaDuyet, leaveStats.TuChoi],
                borderColor: '#e91e63',
                fill: false
              }]
            }}
            options={chartOptions}
          />
        </Box>
      </Paper>

      <Divider sx={{ my: 4 }} />
      <Typography variant="h4" sx={{ fontSize: '2rem', mb: 2 }}>Thống kê Phòng ban</Typography>
      {renderFilter(dpYear, dpMonth, dpCompare, setDpYear, setDpMonth, setDpCompare, fetchDept)}
      <TableContainer component={Paper} sx={{ maxHeight: 340, overflow: 'auto' }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontSize: '1.5rem', fontWeight: 600 }}>Phòng ban</TableCell>
              <TableCell sx={{ fontSize: '1.5rem', fontWeight: 600 }} align="right">Số NV</TableCell>
              <TableCell sx={{ fontSize: '1.5rem', fontWeight: 600 }} align="right">Nghỉ phép</TableCell>
              <TableCell sx={{ fontSize: '1.5rem', fontWeight: 600 }} align="right">Khen thưởng</TableCell>
              <TableCell sx={{ fontSize: '1.5rem', fontWeight: 600 }} align="right">Kỷ luật</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {deptStats.map((r, i) => (
              <TableRow key={i}>
                <TableCell sx={{ fontSize: '1.2rem' }}>{r.TenPhongBan}</TableCell>
                <TableCell sx={{ fontSize: '1.2rem' }} align="right">{r.SoNhanVien}</TableCell>
                <TableCell sx={{ fontSize: '1.2rem' }} align="right">{r.SoNghiPhep}</TableCell>
                <TableCell sx={{ fontSize: '1.2rem' }} align="right">{r.SoKhenThuong}</TableCell>
                <TableCell sx={{ fontSize: '1.2rem' }} align="right">{r.SoKyLuat}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
    </Layout>
  );
};

export default Dashboard;
