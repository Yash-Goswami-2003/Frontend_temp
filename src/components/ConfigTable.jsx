import { useState, useEffect, useMemo } from "react";
import { getConfigurations, getUserId } from "../utils/api";

// Icons
const Icons = {
  Search: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  ),
  Folder: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
    </svg>
  ),
  User: () => (
    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  ChevronLeft: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
    </svg>
  ),
  ChevronRight: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
    </svg>
  ),
  SortAsc: () => (
    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
    </svg>
  ),
  SortDesc: () => (
    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  ),
  X: () => (
    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
};

// Status badge
const StatusBadge = ({ status }) => {
  const styles = {
    Active: "text-emerald-600 bg-emerald-50",
    Draft: "text-amber-600 bg-amber-50",
    Archived: "text-slate-500 bg-slate-100",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${styles[status] || styles.Draft}`}>
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${status === "Active" ? "bg-emerald-500" : status === "Draft" ? "bg-amber-500" : "bg-slate-400"}`} />
      {status || "Draft"}
    </span>
  );
};

// Type badge
const TypeBadge = ({ type }) => {
  const styles = {
    SCREENS: "text-blue-600 bg-blue-50",
    FIELDS: "text-violet-600 bg-violet-50",
    LAYOUTS: "text-teal-600 bg-teal-50",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${styles[type] || "text-slate-600 bg-slate-100"}`}>
      <Icons.Folder />
      <span className="ml-1">{type}</span>
    </span>
  );
};

export default function ConfigTable({ 
  onRowClick, 
  showFilters = true,
  pageSize = 10,
  className = "" 
}) {
  const [configs, setConfigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  
  // Sort
  const [sortField, setSortField] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState("desc");
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  const currentUserId = getUserId();

  // Fetch all configurations by making parallel requests for each type
  useEffect(() => {
    const fetchAllConfigs = async () => {
      try {
        setLoading(true);
        const types = ["SCREENS", "FIELDS", "LAYOUTS"];
        const responses = await Promise.all(
          types.map(type => getConfigurations(type, true).catch(() => ({ documents: [] })))
        );
        
        const allDocs = responses.flatMap(r => r.documents || []);
        setConfigs(allDocs);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAllConfigs();
  }, []);

  // Filter and sort
  const filteredConfigs = useMemo(() => {
    let result = [...configs];

    // Search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter((config) => {
        const name = config.data?.name || config.name || "";
        const id = String(config.id || "");
        const type = config.config_type || "";
        return name.toLowerCase().includes(query) || id.includes(query) || type.toLowerCase().includes(query);
      });
    }

    // Type filter
    if (typeFilter !== "ALL") {
      result = result.filter((config) => config.config_type === typeFilter);
    }

    // Sort
    result.sort((a, b) => {
      let aVal, bVal;
      switch (sortField) {
        case "name":
          aVal = a.data?.name || a.name || "";
          bVal = b.data?.name || b.name || "";
          break;
        case "type":
          aVal = a.config_type || "";
          bVal = b.config_type || "";
          break;
        case "id":
          aVal = a.id || 0;
          bVal = b.id || 0;
          break;
        default:
          aVal = a.createdAt || a.created_at || 0;
          bVal = b.createdAt || b.created_at || 0;
      }
      return sortDirection === "asc" ? (aVal > bVal ? 1 : -1) : (aVal < bVal ? 1 : -1);
    });

    return result;
  }, [configs, searchQuery, typeFilter, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(filteredConfigs.length / pageSize);
  const paginatedConfigs = filteredConfigs.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setTypeFilter("ALL");
    setCurrentPage(1);
  };

  const hasActiveFilters = searchQuery || typeFilter !== "ALL";

  if (loading) {
    return (
      <div className={`bg-white rounded-xl border border-slate-200/60 p-8 ${className}`}>
        <div className="flex items-center justify-center gap-3">
          <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-slate-500">Loading configurations...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-white rounded-xl border border-slate-200/60 p-8 ${className}`}>
        <div className="text-center">
          <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center text-red-500 mx-auto mb-3">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-sm text-slate-600">Failed to load configurations</p>
          <p className="text-xs text-slate-400 mt-1">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-xl border border-slate-200/60 overflow-hidden ${className}`}>
      {/* Header with filters */}
      {showFilters && (
        <div className="p-4 border-b border-slate-100 space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <Icons.Search />
              </div>
              <input
                type="text"
                placeholder="Search configurations..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all"
              />
            </div>

            {/* Type filter */}
            <select
              value={typeFilter}
              onChange={(e) => { setTypeFilter(e.target.value); setCurrentPage(1); }}
              className="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 bg-white min-w-[140px]"
            >
              <option value="ALL">All Types</option>
              <option value="SCREENS">Screens</option>
              <option value="FIELDS">Fields</option>
              <option value="LAYOUTS">Layouts</option>
            </select>
          </div>

          {/* Active filters */}
          {hasActiveFilters && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-slate-500">Active filters:</span>
              {searchQuery && (
                <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded">
                  Search: &quot;{searchQuery}&quot;
                  <button onClick={() => setSearchQuery("")} className="hover:text-blue-900"><Icons.X /></button>
                </span>
              )}
              {typeFilter !== "ALL" && (
                <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-violet-50 text-violet-700 rounded">
                  Type: {typeFilter}
                  <button onClick={() => setTypeFilter("ALL")} className="hover:text-violet-900"><Icons.X /></button>
                </span>
              )}
              <button onClick={clearFilters} className="text-xs text-slate-500 hover:text-slate-700 underline ml-2">Clear all</button>
            </div>
          )}
        </div>
      )}

      {/* Results count */}
      <div className="px-4 py-2 bg-slate-50 border-b border-slate-100">
        <span className="text-xs text-slate-500">
          Showing {filteredConfigs.length} configuration{filteredConfigs.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100">
              <th 
                className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-50 transition-colors"
                onClick={() => handleSort("id")}
              >
                <div className="flex items-center gap-1">
                  ID
                  {sortField === "id" && (sortDirection === "asc" ? <Icons.SortAsc /> : <Icons.SortDesc />)}
                </div>
              </th>
              <th 
                className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-50 transition-colors"
                onClick={() => handleSort("name")}
              >
                <div className="flex items-center gap-1">
                  Name
                  {sortField === "name" && (sortDirection === "asc" ? <Icons.SortAsc /> : <Icons.SortDesc />)}
                </div>
              </th>
              <th 
                className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-50 transition-colors"
                onClick={() => handleSort("type")}
              >
                <div className="flex items-center gap-1">
                  Type
                  {sortField === "type" && (sortDirection === "asc" ? <Icons.SortAsc /> : <Icons.SortDesc />)}
                </div>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Updated</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginatedConfigs.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center">
                  <div className="text-slate-400">
                    <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                    </svg>
                    <p className="text-sm">No configurations found</p>
                    <p className="text-xs mt-1">Try adjusting your filters</p>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedConfigs.map((config) => {
                const name = config.data?.name || config.name || `Config #${config.id}`;
                return (
                  <tr 
                    key={config.id} 
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                    onClick={() => onRowClick?.(config)}
                  >
                    <td className="px-4 py-3">
                      <span className="text-xs font-mono text-slate-500">#{config.id}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm font-medium text-slate-900">{name}</span>
                    </td>
                    <td className="px-4 py-3">
                      <TypeBadge type={config.config_type} />
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-slate-500">
                        {config.updatedAt || config.updated_at ? new Date(config.updatedAt || config.updated_at).toLocaleDateString() : "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={config.status || "Draft"} />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-500">Page {currentPage} of {totalPages}</span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <Icons.ChevronLeft />
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) pageNum = i + 1;
              else if (currentPage <= 3) pageNum = i + 1;
              else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
              else pageNum = currentPage - 2 + i;
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-7 h-7 rounded-lg text-xs font-medium transition-colors ${
                    currentPage === pageNum ? "bg-blue-600 text-white" : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <Icons.ChevronRight />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
