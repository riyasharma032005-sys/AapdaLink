import React from 'react';
import { 
  AlertCircle, 
  MapPin, 
  Clock, 
  Users, 
  Phone, 
  UserCheck, 
  CheckCircle2, 
  ArrowRight,
  ExternalLink 
} from 'lucide-react';
import StatusBadge from './StatusBadge';

const RequestCard = ({ 
  request, 
  onAccept, 
  onStatusUpdate, 
  showActions = true, 
  currentUserId = null,
  currentUserRole = 'citizen' 
}) => {
  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'Critical':
        return <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">Critical</span>;
      case 'High':
        return <span className="bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">High</span>;
      case 'Medium':
        return <span className="bg-yellow-500 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">Medium</span>;
      default:
        return <span className="bg-slate-500 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">Low</span>;
    }
  };

  const getTypeIconColor = (type) => {
    switch (type) {
      case 'Rescue': return 'text-red-600 bg-red-50 border-red-200';
      case 'Medicine': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'Food': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'Water': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'Shelter': return 'text-purple-600 bg-purple-50 border-purple-200';
      default: return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  const isAssignedToMe = currentUserId && request.assignedTo && (request.assignedTo._id === currentUserId || request.assignedTo === currentUserId);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col justify-between">
      <div>
        {/* Header strip */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className={`px-2.5 py-1 text-xs font-bold rounded-lg border ${getTypeIconColor(request.emergencyType)}`}>
              {request.emergencyType}
            </span>
            {getPriorityBadge(request.priority)}
          </div>
          <StatusBadge status={request.status} />
        </div>

        {/* Card Body */}
        <div className="p-5 space-y-3">
          <h3 className="font-bold text-slate-900 text-base line-clamp-1">{request.title}</h3>
          <p className="text-slate-600 text-xs leading-relaxed line-clamp-2">{request.description}</p>

          {request.imageUrl && (
            <div className="mt-2 rounded-lg overflow-hidden border border-slate-100 max-h-40 bg-slate-100">
              <img 
                src={`http://localhost:5000${request.imageUrl}`} 
                alt="Distress incident" 
                className="w-full h-36 object-cover"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            </div>
          )}

          <div className="pt-2 border-t border-slate-100 space-y-1.5 text-xs text-slate-500">
            <div className="flex items-center space-x-1.5 text-slate-700">
              <MapPin className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
              <span className="truncate">{request.address}</span>
            </div>

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center space-x-1 text-slate-600">
                <Users className="w-3.5 h-3.5 text-slate-400" />
                <span>Affected: <strong>{request.numberOfPeopleAffected || 1} people</strong></span>
              </div>
              <div className="flex items-center space-x-1 text-slate-600">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>{request.contactPhone}</span>
              </div>
            </div>

            {request.assignedTo && (
              <div className="mt-2 bg-slate-50 p-2 rounded-lg border border-slate-100 flex items-center justify-between text-xs text-slate-700">
                <span className="flex items-center space-x-1 text-slate-500">
                  <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Responder:</span>
                </span>
                <span className="font-semibold text-slate-900">
                  {request.assignedTo.name || 'Volunteer/NGO'}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Card Actions Footer */}
      {showActions && (
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            {new Date(request.createdAt).toLocaleDateString()} at {new Date(request.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>

          <div className="flex items-center space-x-2">
            {/* Volunteer / NGO Accept Button */}
            {(currentUserRole === 'volunteer' || currentUserRole === 'ngo') && request.status === 'Pending' && onAccept && (
              <button
                onClick={() => onAccept(request._id)}
                className="bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-sm transition flex items-center space-x-1"
              >
                <span>Accept SOS</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

            {/* In Progress to Completed */}
            {isAssignedToMe && request.status === 'In Progress' && onStatusUpdate && (
              <button
                onClick={() => onStatusUpdate(request._id, 'Completed')}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-sm transition flex items-center space-x-1"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Mark Completed</span>
              </button>
            )}

            {/* Citizen Cancel */}
            {currentUserRole === 'citizen' && request.status === 'Pending' && onStatusUpdate && (
              <button
                onClick={() => onStatusUpdate(request._id, 'Cancelled')}
                className="text-slate-500 hover:text-red-600 text-xs font-medium px-2 py-1"
              >
                Cancel Request
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RequestCard;
