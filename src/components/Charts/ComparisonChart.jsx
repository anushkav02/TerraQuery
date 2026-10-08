import React, { useState } from 'react';

export default function ComparisonChart({
  data = [],
  title = 'Rainfall Comparison'
}) {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  if (!data || data.length === 0) return null;

  // Make the component tolerant of slightly different result shapes.
  const normalizedData = data
    .map((item) => ({
      label:
        item.label ||
        item.District ||
        item.district ||
        'Unknown',
      value: Number(
        item.value ??
        item.avgDailyActual ??
        item['Daily Actual'] ??
        0
      )
    }))
    .filter((item) => Number.isFinite(item.value));

  if (normalizedData.length === 0) return null;

  const maxValue = Math.max(
    ...normalizedData.map((item) => item.value),
    1
  );

  const highestValue = Math.max(
    ...normalizedData.map((item) => item.value)
  );

  const lowestValue = Math.min(
    ...normalizedData.map((item) => item.value)
  );

  const highestItem = normalizedData.find(
    (item) => item.value === highestValue
  );

  const lowestItem = normalizedData.find(
    (item) => item.value === lowestValue
  );

  const difference = highestValue - lowestValue;

  const percentageDifference =
    lowestValue > 0
      ? (difference / lowestValue) * 100
      : 0;

  return (
    <div
      className="glass-card"
      style={{
        padding: '20px',
        height: '100%',
        minHeight: '330px',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Subtle glow */}
      <div
        style={{
          position: 'absolute',
          top: '-80px',
          right: '-80px',
          width: '180px',
          height: '180px',
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(0, 242, 254, 0.08), transparent 70%)',
          pointerEvents: 'none'
        }}
      />

      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: '12px',
          marginBottom: '18px',
          position: 'relative',
          zIndex: 1
        }}
      >
        <div>
          <span
            className="pill pill-cyan"
            style={{
              fontSize: '0.62rem',
              letterSpacing: '0.4px'
            }}
          >
            COMPARISON CHART
          </span>

          <h4
            style={{
              fontSize: '0.98rem',
              fontWeight: 700,
              marginTop: '6px',
              marginBottom: '3px'
            }}
          >
            {title}
          </h4>

          <span
            style={{
              fontSize: '0.7rem',
              color: 'var(--text-muted)'
            }}
          >
            Average daily rainfall
          </span>
        </div>

        {/* Winner badge */}
        {highestItem && normalizedData.length > 1 && (
          <div
            style={{
              padding: '6px 9px',
              borderRadius: '8px',
              background: 'rgba(0, 242, 254, 0.07)',
              border: '1px solid rgba(0, 242, 254, 0.18)',
              textAlign: 'right',
              whiteSpace: 'nowrap'
            }}
          >
            <div
              style={{
                fontSize: '0.55rem',
                color: 'var(--text-muted)',
                letterSpacing: '0.5px'
              }}
            >
              HIGHER
            </div>

            <div
              style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                color: '#67e8f9'
              }}
            >
              {highestItem.label}
            </div>
          </div>
        )}
      </div>

      {/* Comparison bars */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: '22px',
          padding: '6px 2px 10px',
          position: 'relative',
          zIndex: 1
        }}
      >
        {normalizedData.map((item, index) => {
          const percentage =
            (item.value / maxValue) * 100;

          const isHighest =
            item.value === highestValue &&
            normalizedData.length > 1;

          const isHovered =
            hoveredIdx === index;

          return (
            <div
              key={`${item.label}-${index}`}
              onMouseEnter={() => setHoveredIdx(index)}
              onMouseLeave={() => setHoveredIdx(null)}
              style={{
                cursor: 'default'
              }}
            >
              {/* Label + value */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '7px'
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <span
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: isHighest
                        ? '#00F2FE'
                        : '#10B981',
                      boxShadow: isHovered
                        ? `0 0 8px ${
                            isHighest
                              ? '#00F2FE'
                              : '#10B981'
                          }`
                        : 'none',
                      transition: 'box-shadow 0.2s ease'
                    }}
                  />

                  <span
                    style={{
                      fontSize: '0.78rem',
                      fontWeight: isHighest ? 700 : 600,
                      color: isHovered
                        ? '#FFFFFF'
                        : 'var(--text-primary)',
                      letterSpacing: '0.2px'
                    }}
                  >
                    {item.label}
                  </span>
                </div>

                <span
                  style={{
                    fontSize: '0.78rem',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 700,
                    color: isHighest
                      ? '#67e8f9'
                      : 'var(--text-secondary)'
                  }}
                >
                  {item.value.toFixed(2)} mm
                </span>
              </div>

              {/* Track */}
              <div
                style={{
                  width: '100%',
                  height: '18px',
                  borderRadius: '999px',
                  background: 'rgba(148, 163, 184, 0.08)',
                  border:
                    '1px solid rgba(148, 163, 184, 0.08)',
                  overflow: 'hidden'
                }}
              >
                {/* Actual bar */}
                <div
                  style={{
                    width: `${Math.max(percentage, 3)}%`,
                    height: '100%',
                    borderRadius: '999px',
                    background: isHighest
                      ? 'linear-gradient(90deg, #0891b2, #00F2FE)'
                      : 'linear-gradient(90deg, #047857, #10B981)',
                    boxShadow: isHovered
                      ? `0 0 14px ${
                          isHighest
                            ? 'rgba(0, 242, 254, 0.35)'
                            : 'rgba(16, 185, 129, 0.3)'
                        }`
                      : 'none',
                    transition:
                      'width 0.6s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s ease'
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Insight */}
      {normalizedData.length > 1 && (
        <div
          style={{
            marginTop: '10px',
            padding: '10px 12px',
            borderRadius: '9px',
            background: 'rgba(15, 23, 42, 0.55)',
            border:
              '1px solid rgba(148, 163, 184, 0.09)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '10px',
            position: 'relative',
            zIndex: 1
          }}
        >
          <div>
            <div
              style={{
                fontSize: '0.58rem',
                color: 'var(--text-muted)',
                letterSpacing: '0.6px',
                marginBottom: '3px'
              }}
            >
              COMPARISON INSIGHT
            </div>

            <div
              style={{
                fontSize: '0.72rem',
                color: 'var(--text-secondary)'
              }}
            >
              {highestItem.label} recorded{' '}
              <strong
                style={{
                  color: '#67e8f9'
                }}
              >
                {difference.toFixed(2)} mm
              </strong>{' '}
              more average rainfall.
            </div>
          </div>

          <div
            style={{
              fontSize: '0.82rem',
              fontFamily: 'var(--font-mono)',
              fontWeight: 700,
              color: '#67e8f9',
              whiteSpace: 'nowrap'
            }}
          >
            +{percentageDifference.toFixed(1)}%
          </div>
        </div>
      )}

      {/* Footer */}
      <div
        style={{
          marginTop: '12px',
          paddingTop: '9px',
          borderTop:
            '1px solid rgba(148, 163, 184, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.62rem',
          color: 'var(--text-muted)',
          position: 'relative',
          zIndex: 1
        }}
      >
        <span>
          MongoDB Atlas • Real IMD rainfall data
        </span>

        <span>
          Millimeters (mm)
        </span>
      </div>
    </div>
  );
}