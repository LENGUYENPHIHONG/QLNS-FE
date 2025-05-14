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
  TextField,
  Button,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody
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
  LineElement
} from 'chart.js';
import {
  getEmployeeOverview,
  getContractStatistics,
  getLeaveStatistics,
  getDepartmentStatistics
} from '../../api/DashboardApi';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement);

const Dashboard = () => {
  const today = new Date();
  const [ovYear, setOvYear] = useState(today.getFullYear());
  const [ovMonth, setOvMonth] = useState(today.getMonth() + 1);
  const [ovCompare, setOvCompare] = useState('');

  const [ctYear, setCtYear] = useState(today.getFullYear());
  const [ctMonth, setCtMonth] = useState(today.getMonth() + 1);
  const [ctCompare, setCtCompare] = useState('');

  const [lvYear, setLvYear] = useState(today.getFullYear());
  const [lvMonth, setLvMonth] = useState(today.getMonth() + 1);
  const [lvCompare, setLvCompare] = useState('');

  const [dpYear, setDpYear] = useState(today.getFullYear());
  const [dpMonth, setDpMonth] = useState(today.getMonth() + 1);
  const [dpCompare, setDpCompare] = useState('');

  const [overview, setOverview] = useState({ DangLam:0,ThuViec:0,DaNghi:0,GioiTinh:[],LoaiNhanVien:[] });
  const [contractStats, setContractStats] = useState({ DangHieuLuc:0,SapHetHan:0,DaKetThuc:0,GiaHan:0 });
  const [leaveStats, setLeaveStats] = useState({ TongDon:0,ChoDuyet:0,DaDuyet:0,TuChoi:0 });
  const [deptStats, setDeptStats] = useState([]);

  useEffect(() => {
    fetchOverview();
    fetchContract();
    fetchLeave();
    fetchDept();
  }, []);

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

  const renderFilter = (year, month, compare, setYear, setMonth, setCompare, onApply) => (
    <Box display="flex" flexWrap="wrap" alignItems="center" gap={2} mb={2}>
      <TextField
        label="Năm"
        type="number"
        value={year}
        onChange={e => setYear(+e.target.value)}
        InputProps={{ inputProps:{min:2000,max:today.getFullYear()}}}
        size="small" sx={{ width:100 }}
      />
      <FormControl size="small" sx={{ width:100 }}>
        <InputLabel>Tháng</InputLabel>
        <Select value={month} label="Tháng" onChange={e=>setMonth(+e.target.value)}>
          {[...Array(12)].map((_,i)=><MenuItem key={i+1} value={i+1}>{i+1}</MenuItem>)}
        </Select>
      </FormControl>
      <FormControl size="small" sx={{ width:140 }}>
        <InputLabel>So sánh</InputLabel>
        <Select value={compare} label="So sánh" onChange={e=>setCompare(e.target.value)}>
          <MenuItem value="">Không</MenuItem>
          <MenuItem value="month">Tháng trước</MenuItem>
          <MenuItem value="year">Năm trước</MenuItem>
        </Select>
      </FormControl>
      <Button variant="contained" size="small" onClick={onApply}>Áp dụng</Button>
    </Box>
  );

  const chartOptions = { maintainAspectRatio:false, responsive:true };

  return (
    <Box p={4}>
      <Typography variant="h5" gutterBottom>Tổng quan Nhân sự</Typography>
      {renderFilter(ovYear,ovMonth,ovCompare,setOvYear,setOvMonth,setOvCompare, fetchOverview)}
      <Grid container spacing={3} mb={2}>
        <Grid item xs={12} sm={4}><InfoCard title="Đang làm việc" value={overview.DangLam} icon={<PeopleIcon />} color="#4caf50"/></Grid>
        <Grid item xs={12} sm={4}><InfoCard title="Thử việc" value={overview.ThuViec} icon={<PeopleIcon />} color="#2196f3"/></Grid>
        <Grid item xs={12} sm={4}><InfoCard title="Đã nghỉ" value={overview.DaNghi} icon={<PeopleIcon />} color="#f44336"/></Grid>
      </Grid>
      <Grid container spacing={2} mb={4}>
        <Grid item xs={12} md={6}>
          <Paper sx={{p:2,height:300}}>
            <Typography>Giới tính</Typography>
            <Box sx={{height:240}}><Pie data={{labels:overview.GioiTinh.map(g=>g.GioiTinh),datasets:[{data:overview.GioiTinh.map(g=>g.SoLuong),backgroundColor:['#3f51b5','#4caf50','#f44336','#ff9800']}]}} options={chartOptions}/></Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{p:2,height:300}}>
            <Typography>Loại nhân viên</Typography>
            <Box sx={{height:240}}><Bar data={{labels:overview.LoaiNhanVien.map(l=>l.Loai),datasets:[{label:'Số NV',data:overview.LoaiNhanVien.map(l=>l.SoLuong),backgroundColor:'#1976d2'}]}} options={chartOptions}/></Box>
          </Paper>
        </Grid>
      </Grid>

      <Divider sx={{my:4}}/>
      <Typography variant="h5" gutterBottom>Thống kê Hợp đồng</Typography>
      {renderFilter(ctYear,ctMonth,ctCompare,setCtYear,setCtMonth,setCtCompare, fetchContract)}
      <Paper sx={{p:2,height:340,mb:4}}>
        <Typography>Hợp đồng</Typography>
        <Box sx={{height:280}}>
          <Bar data={{labels:['Hiệu lực','Sắp hết hạn','Đã kết thúc','Gia hạn'],datasets:[{label:'Số lượng',data:[contractStats.DangHieuLuc,contractStats.SapHetHan,contractStats.DaKetThuc,contractStats.GiaHan],backgroundColor:'#00897b'}]}} options={chartOptions}/>
        </Box>
      </Paper>

      <Divider sx={{my:4}}/>
      <Typography variant="h5" gutterBottom>Thống kê Nghỉ phép</Typography>
      {renderFilter(lvYear,lvMonth,lvCompare,setLvYear,setLvMonth,setLvCompare, fetchLeave)}
      <Paper sx={{p:2,height:340,mb:4}}>
        <Typography>Nghỉ phép</Typography>
        <Box sx={{height:280}}><Line data={{labels:['Tổng','Chờ duyệt','Đã duyệt','Từ chối'],datasets:[{label:'Số đơn',data:[leaveStats.TongDon,leaveStats.ChoDuyet,leaveStats.DaDuyet,leaveStats.TuChoi],borderColor:'#e91e63',fill:false}]}} options={chartOptions}/></Box>
      </Paper>

      <Divider sx={{my:4}}/>
      <Typography variant="h5" gutterBottom>Thống kê Phòng ban</Typography>
      {renderFilter(dpYear,dpMonth,dpCompare,setDpYear,setDpMonth,setDpCompare, fetchDept)}
      <TableContainer component={Paper} sx={{maxHeight:340,overflow:'auto'}}>
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
            {deptStats.map((r,i)=>(<TableRow key={i}><TableCell>{r.TenPhongBan}</TableCell><TableCell align="right">{r.SoNhanVien}</TableCell><TableCell align="right">{r.SoNghiPhep}</TableCell><TableCell align="right">{r.SoKhenThuong}</TableCell><TableCell align="right">{r.SoKyLuat}</TableCell></TableRow>))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Dashboard;
