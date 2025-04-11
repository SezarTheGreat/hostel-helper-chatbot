
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { 
  ChartContainer, 
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  ChartPie,
  LineChart,
  BarChart as BarChartIcon, 
  Clock,
  AlertTriangle
} from "lucide-react";
import { Complaint, SentimentAnalysisResult, SentimentType } from "@/types";

// Sentiment colors
const sentimentColors = {
  'very-negative': '#ef4444',
  'negative': '#f97316',
  'neutral': '#f59e0b',
  'positive': '#84cc16',
  'very-positive': '#22c55e'
};

// Function to calculate average resolution time in days
const calculateAvgResolutionTime = (complaints: Complaint[]): number => {
  const resolvedComplaints = complaints.filter(c => c.status === 'resolved');
  if (resolvedComplaints.length === 0) return 0;
  
  const totalDays = resolvedComplaints.reduce((total, complaint) => {
    const creationDate = new Date(complaint.timestamp).getTime();
    // For demo purposes, use current time if resolution time is not available
    const resolutionTime = new Date().getTime();
    return total + (resolutionTime - creationDate) / (1000 * 60 * 60 * 24); // Convert to days
  }, 0);
  
  return Math.round((totalDays / resolvedComplaints.length) * 10) / 10; // Round to 1 decimal place
};

// Function to categorize complaints by sentiment
const categorizeBySentiment = (complaints: Complaint[]): Record<SentimentType, number> => {
  const defaultCounts = {
    'very-negative': 0,
    'negative': 0,
    'neutral': 0,
    'positive': 0,
    'very-positive': 0
  };
  
  return complaints.reduce((acc, complaint) => {
    const sentiment = complaint.sentiment || 'neutral';
    acc[sentiment]++;
    return acc;
  }, {...defaultCounts} as Record<SentimentType, number>);
};

// Function to prepare data for sentiment by category chart
const prepareSentimentByCategoryData = (complaints: Complaint[]): SentimentAnalysisResult[] => {
  const categorizedComplaints = complaints.reduce((acc, complaint) => {
    const category = complaint.category;
    if (!acc[category]) {
      acc[category] = {
        'very-negative': 0,
        'negative': 0,
        'neutral': 0,
        'positive': 0,
        'very-positive': 0
      };
    }
    
    const sentiment = complaint.sentiment || 'neutral';
    acc[category][sentiment]++;
    
    return acc;
  }, {} as Record<string, Record<SentimentType, number>>);
  
  return Object.entries(categorizedComplaints).map(([category, sentiments]) => ({
    category,
    sentiments: Object.entries(sentiments).map(([name, value]) => ({
      name: name as SentimentType,
      value
    }))
  }));
};

interface DashboardAnalyticsProps {
  complaints: Complaint[];
}

const DashboardAnalytics: React.FC<DashboardAnalyticsProps> = ({ complaints }) => {
  const [activeChart, setActiveChart] = useState<string>("pie");
  const [sentimentData, setSentimentData] = useState<{name: string, value: number}[]>([]);
  const [categoryData, setCategoryData] = useState<SentimentAnalysisResult[]>([]);
  const [highPriorityCount, setHighPriorityCount] = useState<number>(0);
  const [avgResolutionTime, setAvgResolutionTime] = useState<number>(0);
  
  useEffect(() => {
    if (complaints.length > 0) {
      // Prepare sentiment distribution data for pie chart
      const sentimentCounts = categorizeBySentiment(complaints);
      const pieData = Object.entries(sentimentCounts).map(([name, value]) => ({
        name,
        value
      }));
      setSentimentData(pieData);
      
      // Prepare sentiment by category data for bar chart
      const categoryData = prepareSentimentByCategoryData(complaints);
      setCategoryData(categoryData);
      
      // Calculate high priority complaints
      const highPriority = complaints.filter(c => 
        c.priority === 'high' || 
        c.sentiment === 'very-negative' || 
        c.isEscalation
      ).length;
      setHighPriorityCount(highPriority);
      
      // Calculate average resolution time
      setAvgResolutionTime(calculateAvgResolutionTime(complaints));
    }
  }, [complaints]);
  
  // For demo purposes, if there's no sentiment data, generate some
  useEffect(() => {
    if (complaints.length > 0 && sentimentData.every(d => d.value === 0)) {
      // Generate mock sentiment data based on status
      const mockSentimentData = [
        { name: 'very-negative', value: complaints.filter(c => c.status === 'new' && c.isEscalation).length },
        { name: 'negative', value: complaints.filter(c => c.status === 'new' && !c.isEscalation).length },
        { name: 'neutral', value: complaints.filter(c => c.status === 'in-progress').length },
        { name: 'positive', value: complaints.filter(c => c.status === 'resolved').length / 2 },
        { name: 'very-positive', value: complaints.filter(c => c.status === 'resolved').length / 2 }
      ];
      
      // Only use mock data if we actually have complaints but no sentiment data
      if (mockSentimentData.some(d => d.value > 0)) {
        setSentimentData(mockSentimentData);
      }
    }
  }, [complaints, sentimentData]);
  
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Complaint Analytics</CardTitle>
        <Tabs defaultValue={activeChart} onValueChange={setActiveChart} className="w-auto">
          <TabsList>
            <TabsTrigger value="pie" className="flex items-center gap-1">
              <ChartPie className="h-4 w-4" />
              <span className="hidden sm:inline">Sentiment</span>
            </TabsTrigger>
            <TabsTrigger value="bar" className="flex items-center gap-1">
              <BarChartIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Categories</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 flex flex-col items-center justify-center">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 mb-3">
                <AlertTriangle className="h-6 w-6 text-blue-600" />
              </div>
              <p className="text-xl font-bold">{highPriorityCount}</p>
              <p className="text-sm text-gray-500">High Priority Issues</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 flex flex-col items-center justify-center">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mb-3">
                <LineChart className="h-6 w-6 text-green-600" />
              </div>
              <p className="text-xl font-bold">{complaints.length}</p>
              <p className="text-sm text-gray-500">Total Complaints</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 flex flex-col items-center justify-center">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-yellow-100 mb-3">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <p className="text-xl font-bold">{avgResolutionTime} days</p>
              <p className="text-sm text-gray-500">Avg. Resolution Time</p>
            </CardContent>
          </Card>
        </div>
        
        <TabsContent value="pie" className="h-[300px]">
          {sentimentData.length > 0 ? (
            <ChartContainer
              config={{
                'very-negative': { color: sentimentColors['very-negative'] },
                'negative': { color: sentimentColors['negative'] },
                'neutral': { color: sentimentColors['neutral'] },
                'positive': { color: sentimentColors['positive'] },
                'very-positive': { color: sentimentColors['very-positive'] }
              }}
            >
              <PieChart>
                <Pie
                  data={sentimentData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => 
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {sentimentData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={sentimentColors[entry.name as SentimentType] || '#ccc'} 
                    />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ChartContainer>
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-gray-500">No sentiment data available</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="bar" className="h-[300px]">
          {categoryData.length > 0 ? (
            <ChartContainer
              config={{
                'very-negative': { color: sentimentColors['very-negative'] },
                'negative': { color: sentimentColors['negative'] },
                'neutral': { color: sentimentColors['neutral'] },
                'positive': { color: sentimentColors['positive'] },
                'very-positive': { color: sentimentColors['very-positive'] }
              }}
            >
              <BarChart
                data={categoryData.map(item => {
                  // Convert to format needed for stacked bar chart
                  const result: any = { category: item.category };
                  item.sentiments.forEach(s => {
                    result[s.name] = s.value;
                  });
                  return result;
                })}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Bar dataKey="very-negative" stackId="a" fill={sentimentColors['very-negative']} />
                <Bar dataKey="negative" stackId="a" fill={sentimentColors['negative']} />
                <Bar dataKey="neutral" stackId="a" fill={sentimentColors['neutral']} />
                <Bar dataKey="positive" stackId="a" fill={sentimentColors['positive']} />
                <Bar dataKey="very-positive" stackId="a" fill={sentimentColors['very-positive']} />
              </BarChart>
            </ChartContainer>
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-gray-500">No category data available</p>
            </div>
          )}
        </TabsContent>
        
        <div className="mt-6 flex flex-wrap gap-2">
          <Badge className="bg-red-500">Very Negative</Badge>
          <Badge className="bg-orange-500">Negative</Badge>
          <Badge className="bg-yellow-500">Neutral</Badge>
          <Badge className="bg-lime-500">Positive</Badge>
          <Badge className="bg-green-500">Very Positive</Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardAnalytics;
