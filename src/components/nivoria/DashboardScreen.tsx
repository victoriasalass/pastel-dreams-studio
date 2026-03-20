interface DashboardScreenProps {
  userName: string;
  onNavigateRoutine?: () => void;
}

const DashboardScreen = ({ userName, onNavigateRoutine }: DashboardScreenProps) => {
  return (
    <div className="px-6 pt-12 pb-24">
    </div>
  );
};

export default DashboardScreen;
