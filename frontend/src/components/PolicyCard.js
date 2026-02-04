import React, { useState } from 'react';
import './PolicyCard.css';

/**
 * PolicyCard Component
 * Displays policy recommendations for a sector and allows simulation
 */
function PolicyCard({ policy, onSimulate, simulation }) {
  const [isSimulating, setIsSimulating] = useState(false);

  const handleSimulate = async () => {
    if (policy.has_policy && policy.policy) {
      setIsSimulating(true);
      await onSimulate(policy.policy.name);
      setIsSimulating(false);
    }
  };

  if (!policy) return null;

  const { has_policy, policy: policyData } = policy;

  if (!has_policy) {
    return (
      <div className="policy-card policy-none">
        <div className="policy-header">
          <h2>✅ No Action Required</h2>
        </div>
        <div className="policy-content">
          <p className="policy-message">{policy.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`policy-card policy-${policyData.priority.toLowerCase()} ${policyData.is_health_advisory ? 'health-advisory' : ''}`}>
      {/* Header with Policy Title */}
      <div className="policy-header">
        <div className="policy-title-section">
          <h2>{policyData.is_health_advisory ? '🏥 Health Advisory' : '🔧 Recommended Policy Restrictions'}</h2>
        </div>
      </div>

      {/* Policy Details */}
      <div className="policy-content">
        {/* Policy Name */}
        <div className="policy-name-section">
          <h3>{policyData.name}</h3>
          <span className={`priority-badge priority-${policyData.priority.toLowerCase()}`}>
            {policyData.priority.toUpperCase()}
          </span>
        </div>

        {/* Reason */}
        <div className="policy-section">
          <h3>📋 {policyData.is_health_advisory ? 'Advisory Details' : 'Reason'}</h3>
          <p className="reason-text">{policyData.reason}</p>
        </div>

        {/* Expected Impact - Only show for non-health advisories */}
        {!policyData.is_health_advisory && (
          <div className="policy-metrics">
            <div className="metric">
              <div className="metric-label">Expected PM2.5 Reduction</div>
              <div className="metric-value">
                {policyData.expected_pm25_reduction_percentage}%
              </div>
              <div className="metric-bar">
                <div
                  className="metric-fill"
                  style={{
                    width: `${policyData.expected_pm25_reduction_percentage}%`
                  }}
                ></div>
              </div>
            </div>

            <div className="metric">
              <div className="metric-label">Estimated Time to Effect</div>
              <div className="metric-value">
                {policyData.estimated_time_hours}
                <span className="metric-unit">hrs</span>
              </div>
            </div>
          </div>
        )}

        {/* Health Advisory Info */}
        {policyData.is_health_advisory && (
          <div className="health-advisory-info">
            <div className="advisory-duration">
              <span className="advisory-label">⏱️ Advisory Duration:</span>
              <span className="advisory-value">{policyData.estimated_time_hours} hours</span>
            </div>
            <p className="advisory-note">
              ⚠️ This is a protective health measure, not a pollution reduction policy. 
              Air quality improvement depends on meteorological conditions and source control.
            </p>
          </div>
        )}

        {/* Simulate Button - Only show for non-health advisories */}
        {!policyData.is_health_advisory && (
          <button
            className="button button-primary simulate-button"
            onClick={handleSimulate}
            disabled={isSimulating}
          >
            {isSimulating ? '⏳ Simulating...' : '🔬 Simulate Policy Impact'}
          </button>
        )}
      </div>

      {/* Simulation Results */}
      {simulation && (
        <div className="simulation-results">
          <h3>🎯 Simulation Results</h3>
          
          {/* Confidence Badge */}
          {simulation.confidence && (
            <div className={`confidence-badge confidence-${simulation.confidence}`}>
              {simulation.confidence === 'high' ? '🟢' : simulation.confidence === 'medium' ? '🟡' : '🟠'} 
              {' '}{simulation.confidence.toUpperCase()} CONFIDENCE
            </div>
          )}

          <div className="simulation-content">
            <div className="sim-metric">
              <span className="sim-label">Current PM2.5:</span>
              <span className="sim-value current">
                {simulation.current_pm25.toFixed(1)}
              </span>
              <span className="sim-unit">μg/m³</span>
            </div>

            <div className="sim-arrow">→</div>

            <div className="sim-metric">
              <span className="sim-label">After Policy:</span>
              <span className="sim-value after">
                {simulation.simulated_pm25_after.toFixed(1)}
              </span>
              <span className="sim-unit">μg/m³</span>
            </div>
          </div>

          {/* Reduction Percentage with Range */}
          <div className="sim-reduction">
            <div className="reduction-label">
              Expected Reduction: <span className="reduction-value">-{simulation.reduction_percentage.toFixed(1)}%</span>
              {simulation.reduction_range && (
                <span className="reduction-range">
                  {' '}(Range: {simulation.reduction_range.min}% - {simulation.reduction_range.max}%)
                </span>
              )}
            </div>
            <div className="reduction-bar">
              <div
                className="reduction-fill"
                style={{
                  width: `${Math.min(simulation.reduction_percentage, 100)}%`
                }}
              ></div>
            </div>
          </div>

          {/* PM2.5 Projection Range */}
          {simulation.pm25_range && (
            <div className="pm25-projection">
              <div className="projection-label">📊 PM2.5 Projection Range:</div>
              <div className="projection-values">
                <span className="best-case">Best: {simulation.pm25_range.best_case} μg/m³</span>
                <span className="expected-case">Expected: {simulation.pm25_range.expected} μg/m³</span>
                <span className="worst-case">Worst: {simulation.pm25_range.worst_case} μg/m³</span>
              </div>
            </div>
          )}

          {/* Meteorological Factor */}
          {simulation.met_adjustment_factor && (
            <div className="met-factor">
              🌬️ Weather Impact: {simulation.met_adjustment_factor < 0.8 
                ? `Reduced effectiveness (${(simulation.met_adjustment_factor * 100).toFixed(0)}%) due to poor dispersion` 
                : `Good conditions (${(simulation.met_adjustment_factor * 100).toFixed(0)}% efficiency)`}
            </div>
          )}

          {/* Explanation */}
          <div className="sim-explanation">
            <strong>💡 Details:</strong> {simulation.explanation}
          </div>

          {/* Methodology */}
          {simulation.methodology && (
            <div className="sim-methodology">
              <strong>📚 Methodology:</strong> {simulation.methodology}
            </div>
          )}

          {/* Recommended Action */}
          <div className="sim-action">
            <p>
              <strong>✅ Recommended Action:</strong> Proceed with implementing{' '}
              <em>{simulation.policy_name}</em> to reduce air pollution by{' '}
              {simulation.reduction_percentage.toFixed(1)}% in approximately{' '}
              {policyData.estimated_time_hours} hours.
            </p>
          </div>
        </div>
      )}


    </div>
  );
}

export default PolicyCard;
