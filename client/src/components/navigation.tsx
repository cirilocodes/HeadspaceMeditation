import { Button } from "@/components/ui/button";

interface NavigationProps {
  activeTab: "meditate" | "sleep" | "progress";
  onTabChange: (tab: "meditate" | "sleep" | "progress") => void;
}

export default function Navigation({ activeTab, onTabChange }: NavigationProps) {
  const tabs = [
    { id: "meditate" as const, label: "Meditate" },
    { id: "sleep" as const, label: "Sleep" },
    { id: "progress" as const, label: "Progress" },
  ];

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-700 sticky top-16 z-40 hidden md:block">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex space-x-8">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant="ghost"
              className={`py-4 px-2 border-b-2 ${
                activeTab === tab.id
                  ? "border-primary-blue text-primary-blue"
                  : "border-transparent text-light hover:text-primary-blue"
              } transition-colors rounded-none`}
              onClick={() => onTabChange(tab.id)}
            >
              {tab.label}
            </Button>
          ))}
        </div>
      </div>
    </nav>
  );
}
