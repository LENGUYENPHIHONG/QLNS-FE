import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People'; // Icon cho nhân viên
import AssignmentIcon from '@mui/icons-material/Assignment'; // Icon cho hợp đồng
import BusinessIcon from '@mui/icons-material/Business'; // Icon cho phòng ban
import './infocard.css'; // Import file CSS

const InfoCard = ({ title, value, icon, color }) => {
  return (
    <Card
      className="card" // Sử dụng class CSS từ file infocard.css
      sx={{ backgroundColor: color}} // Màu nền từ props
    >
      <CardContent>
        <Typography variant="h5" component="div" gutterBottom className="title">
          {icon} {title}
        </Typography>
        <Typography variant="h4" component="div" className="value">
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default InfoCard;