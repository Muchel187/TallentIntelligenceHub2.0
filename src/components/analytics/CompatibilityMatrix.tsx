'use client';

import { useState, useEffect } from 'react';

interface CompatibilityData {
  employeeId: string;
  name: string;
  compatibility: {
    [employeeId: string]: {
      score: number;
      riskFactors: string[];
    };
  };
}

export default function CompatibilityMatrix() {
  const [data, setData] = useState<CompatibilityData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);

  useEffect(() => {
    fetchCompatibilityData();
  }, []);

  const fetchCompatibilityData = async () => {
    try {
      const response = await fetch('/api/analytics/compatibility');
      if (response.ok) {
        const result = await response.json();
        setData(result.matrix);
      }
    } catch (error) {
      console.error('Failed to fetch compatibility data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number): string => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    if (score >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getScoreTextColor = (score: number): string => {
    if (score >= 80) return 'text-green-700';
    if (score >= 60) return 'text-yellow-700';
    if (score >= 40) return 'text-orange-700';
    return 'text-red-700';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Lade Kompatibilitätsmatrix...</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <p className="text-gray-600">Nicht genügend Daten für Kompatibilitätsanalyse</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Team Kompatibilitätsmatrix</h2>
        <p className="text-gray-600">
          Klicken Sie auf eine Zelle um Details zu sehen
        </p>
      </div>

      {/* Legend */}
      <div className="flex gap-4 mb-6 flex-wrap">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <span className="text-sm text-gray-700">Sehr gut (80-100)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-500 rounded"></div>
          <span className="text-sm text-gray-700">Gut (60-79)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-orange-500 rounded"></div>
          <span className="text-sm text-gray-700">Mäßig (40-59)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500 rounded"></div>
          <span className="text-sm text-gray-700">Niedrig (0-39)</span>
        </div>
      </div>

      {/* Matrix */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="p-2 border border-gray-200 bg-gray-50"></th>
              {data.map((emp) => (
                <th
                  key={emp.employeeId}
                  className="p-2 border border-gray-200 bg-gray-50 text-xs font-medium text-gray-700 min-w-[60px]"
                  style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
                >
                  {emp.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.employeeId}>
                <th className="p-2 border border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-700 sticky left-0">
                  {row.name}
                </th>
                {data.map((col) => {
                  const compatibility = row.compatibility[col.employeeId];
                  const score = compatibility?.score || 0;
                  const isSelf = row.employeeId === col.employeeId;

                  return (
                    <td
                      key={col.employeeId}
                      className={`p-2 border border-gray-200 text-center cursor-pointer hover:opacity-80 transition ${
                        isSelf ? 'bg-gray-100' : getScoreColor(score)
                      }`}
                      onClick={() =>
                        !isSelf && setSelectedEmployee(`${row.employeeId}-${col.employeeId}`)
                      }
                    >
                      {isSelf ? (
                        <span className="text-gray-400">-</span>
                      ) : (
                        <span className="text-white font-semibold text-sm">{score}</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Details Modal */}
      {selectedEmployee && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedEmployee(null)}
        >
          <div
            className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Kompatibilitäts-Details
            </h3>
            {(() => {
              const [emp1Id, emp2Id] = selectedEmployee.split('-');
              const emp1 = data.find((e) => e.employeeId === emp1Id);
              const emp2 = data.find((e) => e.employeeId === emp2Id);
              const compatibility = emp1?.compatibility[emp2Id];

              if (!emp1 || !emp2 || !compatibility) return null;

              return (
                <div>
                  <div className="mb-4">
                    <div className="text-sm text-gray-600">Zwischen</div>
                    <div className="font-semibold text-gray-900">
                      {emp1.name} ↔ {emp2.name}
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="text-sm text-gray-600 mb-2">Kompatibilitätsscore</div>
                    <div className="flex items-center gap-4">
                      <div
                        className={`text-4xl font-bold ${getScoreTextColor(compatibility.score)}`}
                      >
                        {compatibility.score}%
                      </div>
                      <div className="flex-1 bg-gray-200 rounded-full h-4">
                        <div
                          className={`h-4 rounded-full ${getScoreColor(compatibility.score)}`}
                          style={{ width: `${compatibility.score}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {compatibility.riskFactors.length > 0 && (
                    <div>
                      <div className="text-sm text-gray-600 mb-2">Potenzielle Konflikte</div>
                      <ul className="space-y-2">
                        {compatibility.riskFactors.map((factor, i) => (
                          <li
                            key={i}
                            className="text-sm text-orange-700 bg-orange-50 rounded px-3 py-2"
                          >
                            {factor}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <button
                    onClick={() => setSelectedEmployee(null)}
                    className="mt-6 w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg transition"
                  >
                    Schließen
                  </button>
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
