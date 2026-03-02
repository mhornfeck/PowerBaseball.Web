import React from "react";
import "./BatterCard.css";
import { Batter, BattingLogEntry } from "../../api/generated";
import defaultAvatar from "../../assets/avatar-default.png"

export interface BatterCardProps {
  batter: Batter
}

export const BatterCard: React.FC<BatterCardProps> = ({
    batter
}) => {
  return (
    <div className="batter-card">
      <div className="batter-header">
        <img
          src={defaultAvatar}
          alt={`${batter.firstName} ${batter.lastName}`}
          className="batter-avatar"
        />

        <div className="batter-name-block">
          <div className="batter-jersey">#{batter.jerseyNumber}</div>
          <div className="batter-name">
            {batter.firstName} <span>{batter.lastName.toUpperCase()}</span>
          </div>
        </div>
      </div>

      <div className="batter-today">
        <div className="section-label">Today</div>
        <div className="today-line">
          {batter.statistics?.hits} for {batter.statistics?.atBats}
        </div>
      </div>

      <div className="batter-atbats">
        <div className="section-label">At Bats</div>
        <ul className="atbat-log">
          {batter.log?.entries?.map((entry: BattingLogEntry, index: number) => (
            <li key={index}>{entry.displayString}</li>
          ))}
        </ul>
      </div>

      <div className="batter-season">
        <div className="section-label">Season</div>
        <div className="season-grid">
          <Stat label="AVG" value={batter.statistics?.battingAverageDisplay!} />
          <Stat label="SLG" value={batter.statistics?.sluggingPercentageDisplay!} />
          <Stat label="HR" value={batter.statistics?.homeruns!} />
          <Stat label="RBI" value={batter.statistics?.runsBattedIn!} />
        </div>
      </div>
    </div>
  );
};

interface StatProps {
  label: string;
  value: string | number;
}

const Stat: React.FC<StatProps> = ({ label, value }) => {
  return (
    <div className="season-stat">
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
    </div>
  );
};