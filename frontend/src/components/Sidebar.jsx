import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FileUp, History, Settings, FileText } from 'lucide-react';

const Sidebar = () => {
    const navItems = [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { name: 'Analyze Resume', path: '/analyze', icon: FileUp },
        { name: 'History', path: '/history', icon: History },
        { name: 'Settings', path: '/settings', icon: Settings },
    ];

    return (
        <aside className="w-64 bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800 flex flex-col h-full shadow-sm z-10 transition-colors duration-200">
            <div className="p-6 flex items-center gap-3">
                <div className="bg-primary-600 p-2 rounded-lg text-white">
                    <FileText size={24} />
                </div>
                <h1 className="text-xl font-bold font-sans tracking-tight text-gray-900 dark:text-gray-100">AI Analyzer</h1>
            </div>
            
            <nav className="flex-1 px-4 mt-6 space-y-1">
                {navItems.map((item) => (
                    <NavLink
                        key={item.name}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 font-medium ${
                                isActive
                                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400'
                                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900 hover:text-gray-900 dark:hover:text-gray-100'
                            }`
                        }
                    >
                        <item.icon size={20} className="shrink-0" />
                        {item.name}
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 border-t border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-3 px-4 py-3 text-gray-400 italic text-xs">
                    <span>AI Analyzer</span>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
