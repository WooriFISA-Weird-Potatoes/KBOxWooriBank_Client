import React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import SportsBaseballIcon from '@mui/icons-material/SportsBaseball';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import PeopleIcon from '@mui/icons-material/People';

export default function MainListItems({ handleListItemClick }) {
    return (
        <React.Fragment>
            <ListItemButton onClick={() => handleListItemClick('전체 회원 수')}>
                <ListItemIcon>
                    <PeopleIcon />
                </ListItemIcon>
                <ListItemText primary="전체 회원 수" />
            </ListItemButton>
            <ListItemButton onClick={() => handleListItemClick('퀴즈')}>
                <ListItemIcon>
                    <TipsAndUpdatesIcon />
                </ListItemIcon>
                <ListItemText primary="퀴즈" />
            </ListItemButton>
            <ListItemButton onClick={() => handleListItemClick('승부예측')}>
                <ListItemIcon>
                    <SportsBaseballIcon />
                </ListItemIcon>
                <ListItemText primary="승부예측" />
            </ListItemButton>
            <ListItemButton onClick={() => handleListItemClick('선착순 이벤트')}>
                <ListItemIcon>
                    <CardGiftcardIcon />
                </ListItemIcon>
                <ListItemText primary="선착순 이벤트" />
            </ListItemButton>
        </React.Fragment>
    );
}

