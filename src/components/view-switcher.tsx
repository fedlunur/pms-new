import React from "react";
import "gantt-task-react/dist/index.css";
// import "./ViewSwitcher.css"; // Import the CSS file for custom styles
import { ViewMode } from "gantt-task-react";

type ViewSwitcherProps = {
  isChecked: boolean;
  onViewListChange: (isChecked: boolean) => void;
  onViewModeChange: (viewMode: ViewMode) => void;
};

export const ViewSwitcher: React.FC<ViewSwitcherProps> = ({
  onViewModeChange,
  onViewListChange,
  isChecked,
}) => {
  return (
    <div className="view-container">
      <div className="button-group">
        <button
          className="view-button"
          onClick={() => onViewModeChange(ViewMode.Hour)}
        >
          Hour | 
        </button>
        <button
          className="view-button"
          onClick={() => onViewModeChange(ViewMode.QuarterDay)}
        >
          Quarter of Day |
        </button>
        <button
          className="view-button"
          onClick={() => onViewModeChange(ViewMode.HalfDay)}
        >
          Half of Day  |
        </button>
        <button
          className="view-button"
          onClick={() => onViewModeChange(ViewMode.Day)}
        >
          Day   |
        </button>
        <button
          className="view-button"
          onClick={() => onViewModeChange(ViewMode.Week)}
        >
          Week |
        </button>
        <button
          className="view-button"
          onClick={() => onViewModeChange(ViewMode.Month)}
        >
          Month |
        </button>
        <button
          className="view-button"
          onClick={() => onViewModeChange(ViewMode.Year)}
        >
          Year |
        </button>
        {/* <button
          className="view-button"
          onClick={() => onViewModeChange(ViewMode.QuarterYear)}
        >
          Quarter Year |
        </button> */}
      </div>
      <div className="switch-container">
        <label className="switch">
          <input
            type="checkbox"
            checked={isChecked}
            onChange={() => onViewListChange(!isChecked)}
          />
          <span className="slider"></span>
        </label>
        Show Task List
      </div>
    </div>
  );
};
