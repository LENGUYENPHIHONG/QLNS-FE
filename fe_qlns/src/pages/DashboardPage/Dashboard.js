// src/pages/ExampleDashboard.js
import React, { useState, useEffect } from 'react';
import {
  Grid,
  Typography,
  Box,
  Divider,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button
} from '@mui/material';
import InfoCard from '../../components/InfoCard/infocard';
import PeopleIcon from '@mui/icons-material/People';
import { Pie } from 'react-chartjs-2';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title
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
  LineElement,
  Title
);

const Dashboard = () => {
  const currentYear = new Date().getFullYear();

  // Filters for each section with year and compare
  const [ovYear, setOvYear] = useState(currentYear);
  const [ovCompare, setOvCompare] = useState('');
  const [ctYear, setCtYear] = useState(currentYear);
  const [ctCompare, setCtCompare] = useState('');
  const [lvYear, setLvYear] = useState(currentYear);
  const [lvCompare, setLvCompare] = useState('');
  const [dpYear, setDpYear] = useState(currentYear);
  const [dpCompare, setDpCompare] = useState('');

  // Data states
  const [overview, setOverview] = useState({ DangLam: 0, ThuViec: 0, DaNghi: 0, GioiTinh: [], LoaiNhanVien: [] });
  const [contractStats, setContractStats] = useState({ DangHieuLuc: 0, SapHetHan: 0, DaKetThuc: 0, GiaHan: 0 });
  const [leaveStats, setLeaveStats] = useState({ TongDon: 0, ChoDuyet: 0, DaDuyet: 0, TuChoi: 0 });
  const [deptStats, setDeptStats] = useState([]);

  // Fetch functions
  const fetchOverview = () =>
    getEmployeeOverview(ovYear, ovCompare)
      .then(res => setOverview(res.data.current))
      .catch(console.error);

  const fetchContract = () =>
    getContractStatistics(ctYear, ctCompare)
      .then(res => setContractStats(res.data.current))
      .catch(console.error);

  const fetchLeave = () =>
    getLeaveStatistics(lvYear, lvCompare)
      .then(res => setLeaveStats(res.data.current))
      .catch(console.error);

  const fetchDept = () =>
    getDepartmentStatistics(dpYear, dpCompare)
      .then(res => setDeptStats(res.data.current))
      .catch(console.error);

  useEffect(() => {
    fetchOverview();
    fetchContract();
    fetchLeave();
    fetchDept();
  }, []);

  // Chart data
  const genderData = {
    labels: overview.GioiTinh.map(g => g.GioiTinh),
    datasets: [{ data: overview.GioiTinh.map(g => g.SoLuong), backgroundColor: ['#3f51b5','#4caf50','#f44336','#ff9800'] }]
  };
  const typeData = {
    labels: overview.LoaiNhanVien.map(l => l.Loai),
    datasets: [{ label: 'Số NV', data: overview.LoaiNhanVien.map(l => l.SoLuong), backgroundColor: '#1976d2' }]
  };
  const leaveData = {
    labels: ['Tổng','Chờ duyệt','Đã duyệt','Từ chối'],
    datasets: [{ label: 'Số đơn', data: [leaveStats.TongDon,leaveStats.ChoDuyet,leaveStats.DaDuyet,leaveStats.TuChoi], borderColor: '#e91e63', fill:false }]
  };

  const chartOptions = { maintainAspectRatio: false, responsive: true };

  return (
    <Box p={4}>
      {/* Overview Section */}
      <Typography variant="h5" mb={2}>Tổng quan Nhân sự</Typography>
      <Box display="flex" flexWrap="wrap" alignItems="center" gap={2} mb={2}>
        <TextField
          label="Năm"
          type="number"
          value={ovYear}
          onChange={e => setOvYear(+e.target.value)}
          InputProps={{ inputProps: { min:2000, max:currentYear } }}
          size="small"
          sx={{ width:120 }}
        />
        <FormControl sx={{ width:180 }}>
          <InputLabel>So sánh</InputLabel>
          <Select value={ovCompare} label="So sánh" onChange={e => setOvCompare(e.target.value)}>
            <MenuItem value="">Không</MenuItem>
            <MenuItem value="month">Tháng trước</MenuItem>
            <MenuItem value="year">Năm trước</MenuItem>
          </Select>
        </FormControl>
        <Button variant="contained" size="small" onClick={fetchOverview}>Áp dụng</Button>
      </Box>
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={4}><InfoCard title="Đang làm việc" value={overview.DangLam} icon={<PeopleIcon />} color="#4caf50"/></Grid>
        <Grid item xs={12} sm={4}><InfoCard title="Thử việc" value={overview.ThuViec} icon={<PeopleIcon />} color="#2196f3"/></Grid>
        <Grid item xs={12} sm={4}><InfoCard title="Đã nghỉ" value={overview.DaNghi} icon={<PeopleIcon />} color="#f44336"/></Grid>
      </Grid>
      <Grid container spacing={2} mb={4}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ height:320, p:2 }}>
            <Typography mb={1}>Phân bố Giới tính</Typography>
            <Box sx={{ height:260 }}>
              <Pie data={genderData} options={chartOptions} />
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ height:320, p:2 }}>
            <Typography mb={1}>Loại nhân viên</Typography>
            <Box sx={{ height:260 }}>
              <Bar data={typeData} options={chartOptions} />
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Divider sx={{ my:4 }} />

      {/* Contract Section */}
      <Typography variant="h5" mb={2}>Thống kê Hợp đồng</Typography>
      <Box display="flex" flexWrap="wrap" alignItems="center" gap={2} mb={2}>
        <TextField
          label="Năm"
          type="number"
          value={ctYear}
          onChange={e => setCtYear(+e.target.value)}
          InputProps={{ inputProps: { min:2000, max:currentYear } }}
          size="small"
          sx={{ width:120 }}
        />
        <FormControl sx={{ width:180 }}>
          <InputLabel>So sánh</InputLabel>
          <Select value={ctCompare} label="So sánh" onChange={e => setCtCompare(e.target.value)}>
            <MenuItem value="">Không</MenuItem>
            <MenuItem value="month">Tháng trước</MenuItem>
            <MenuItem value="year">Năm trước</MenuItem>
          </Select>
        </FormControl>
        <Button variant="contained" size="small" onClick={fetchContract}>Áp dụng</Button>
      </Box>
      <Paper sx={{ height:340, p:2, mb:4 }}>
        <Typography mb={1}>Hợp đồng</Typography>
        <Box sx={{ height:290 }}>
          <Bar
            data={{ labels:['Hiệu lực','Sắp hết','Kết thúc','Gia hạn'], datasets:[{ label:'Số lượng', data:[contractStats.DangHieuLuc,contractStats.SapHetHan,contractStats.DaKetThuc,contractStats.GiaHan], backgroundColor:'#00897b' }] }}
            options={chartOptions}
          />
        </Box>
      </Paper>

      <Divider sx={{ my:4 }} />

      {/* Leave Section */}
      <Typography variant="h5" mb={2}>Thống kê Nghỉ phép</Typography>
      <Box display="flex" flexWrap="wrap" alignItems="center" gap={2} mb={2}>
        <TextField
          label="Năm"
          type="number"
          value={lvYear}
          onChange={e => setLvYear(+e.target.value)}
          InputProps={{ inputProps: { min:2000, max:currentYear } }}
          size="small"
          sx={{ width:120 }}
        />
        <FormControl sx={{ width:180 }}>
          <InputLabel>So sánh</InputLabel>
          <Select value={lvCompare} label="So sánh" onChange={e => setLvCompare(e.target.value)}>
            <MenuItem value="">Không</MenuItem>
            <MenuItem value="month">Tháng trước</MenuItem>
            <MenuItem value="year">Năm trước</MenuItem>
          </Select>
        </FormControl>
        <Button variant="contained" size="small" onClick={fetchLeave}>Áp dụng</Button>
      </Box>
      <Paper sx={{ height:340, p:2, mb:4 }}>
        <Typography mb={1}>Nghỉ phép năm {lvYear}</Typography>
        <Box sx={{ height:290 }}>
          <Line data={leaveData} options={chartOptions} />
        </Box>
      </Paper>

      <Divider sx={{ my:4 }} />

      {/* Department Section */}
      <Typography variant="h5" mb={2}>Thống kê Phòng ban</Typography>
      <Box display="flex" flexWrap="wrap" alignItems="center" gap={2} mb={2}>
        <TextField
          label="Năm"
          type="number"
          value={dpYear}
          onChange={e => setDpYear(+e.target.value)}
          InputProps={{ inputProps: { min:2000, max:currentYear } }}
          size="small"
          sx={{ width:120 }}
        />
        <FormControl sx={{ width:180 }}>
          <InputLabel>So sánh</InputLabel>
          <Select value={dpCompare} label="So sánh" onChange={e => setDpCompare(e.target.value)}>
            <MenuItem value="">Không</MenuItem>
            <MenuItem value="month">Tháng trước</MenuItem>
            <MenuItem value="year">Năm trước</MenuItem>
          </Select>
        </FormControl>
        <Button variant="contained" size="small" onClick={fetchDept}>Áp dụng</Button>
      </Box>
      <TableContainer component={Paper} sx={{ maxHeight:340, mb:4, overflow:'auto' }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell>Phòng ban</TableCell>
              <TableCell align="right">Số NV</TableCell>
              <TableCell align="right">Nghỉ phép</TableCell>
              <TableCell align="right">Khen thưởng</TableCell>
              <TableCell align="right">Kỷ luật</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {deptStats.map((r,i)=>(
              <TableRow key={i}>
                <TableCell>{r.TenPhongBan}</TableCell>
                <TableCell align="right">{r.SoNhanVien}</TableCell>
                <TableCell align="right">{r.SoNghiPhep}</TableCell>
                <TableCell align="right">{r.SoKhenThuong}</TableCell>
                <TableCell align="right">{r.SoKyLuat}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Dashboard;
