import { Card, CardContent, Typography } from '@material-ui/core';
import React from 'react';
import './InfoBox.css';

const InfoBox = ({ title, cases, total, isRed, active, ...props }) => {
    return (
        <>
            <Card onClick={props.onClick} className={`infoBox ${active && "infoBox_selected"} ${isRed && "infoBox_red"}`}>
              <CardContent>
                  <Typography className="infoBox_title" color="textSecondary">{title}</Typography>
                  <h2 className={`infoBox_cases ${!isRed && "infoBox_cases_green"}`}>{cases}</h2>
                  <Typography className="infoBox_total">{total} Total</Typography>
              </CardContent>
            </Card>  
        </>
    );
};

export default InfoBox;