// src/components/InfoCard/InfoCard.js
import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import './infocard.css';

/**
 * InfoCard
 * @param {{ title: string; value: number|string; icon: React.ReactNode; color: string; }} props
 */
const InfoCard = ({ title, value, icon, color }) => (
  <Card className="info-card" style={{ borderLeft: `5px solid ${color}` }}>
    <CardContent className="info-card-content">
      <div className="info-card-icon" style={{ color }}>
        {icon}
      </div>
      <div className="info-card-text">
        <Typography variant="subtitle2" className="info-card-title">
          {title}
        </Typography>
        <Typography variant="h4" className="info-card-value">
          {value}
        </Typography>
      </div>
    </CardContent>
  </Card>
);

export default InfoCard;