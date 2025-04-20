import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  AlertTriangle,
  Shield, 
  ShieldAlert, 
  ShieldCheck, 
  Save
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5
    }
  }
};

export default function FraudSettings() {
  const [activeTab, setActiveTab] = useState("rules");
  const [riskThreshold, setRiskThreshold] = useState(75);
  const { toast } = useToast();
  
  const handleSaveSettings = () => {
    toast({
      title: "Settings updated",
      description: "Your fraud prevention settings have been saved",
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Fraud Prevention Settings</h1>
        <Button
          onClick={handleSaveSettings}
          className="bg-green-600 hover:bg-green-700"
        >
          <Save className="h-4 w-4 mr-2" /> Save Settings
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 w-full md:w-1/2">
          <TabsTrigger value="rules">
            <Shield className="h-4 w-4 mr-2" /> Rules
          </TabsTrigger>
          <TabsTrigger value="monitoring">
            <ShieldCheck className="h-4 w-4 mr-2" /> Monitoring
          </TabsTrigger>
          <TabsTrigger value="alerts">
            <AlertTriangle className="h-4 w-4 mr-2" /> Alerts
          </TabsTrigger>
        </TabsList>
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mt-6"
        >
          <TabsContent value="rules">
            <motion.div variants={itemVariants}>
              <Card className="glassmorphism-dark">
                <CardHeader>
                  <CardTitle>Fraud Prevention Rules</CardTitle>
                  <CardDescription>
                    Configure the AI-based fraud detection system rules
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Risk Threshold</h3>
                      <p className="text-sm text-muted-foreground">
                        Set the risk threshold for flagging potentially fraudulent transactions.
                        Transactions with a risk score above this threshold will be flagged for review.
                      </p>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <Label htmlFor="risk-threshold">Risk Threshold: {riskThreshold}%</Label>
                          <span className="text-sm font-medium">
                            {riskThreshold < 50 ? 'Conservative' : 
                             riskThreshold < 80 ? 'Moderate' : 'Aggressive'}
                          </span>
                        </div>
                        <Slider 
                          id="risk-threshold"
                          value={[riskThreshold]} 
                          min={30} 
                          max={95} 
                          step={5}
                          onValueChange={(value) => setRiskThreshold(value[0])}
                          className="py-4"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Low (30%)</span>
                          <span>Medium (60%)</span>
                          <span>High (95%)</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Rule Settings</h3>
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="rule-velocity">Velocity Checks</Label>
                            <p className="text-sm text-muted-foreground">
                              Flag transactions when a user makes too many in a short period
                            </p>
                          </div>
                          <Switch id="rule-velocity" defaultChecked />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="rule-location">Location Anomalies</Label>
                            <p className="text-sm text-muted-foreground">
                              Flag when transactions come from unusual locations for a user
                            </p>
                          </div>
                          <Switch id="rule-location" defaultChecked />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="rule-amount">Amount Anomalies</Label>
                            <p className="text-sm text-muted-foreground">
                              Flag when transaction amounts vary significantly from user patterns
                            </p>
                          </div>
                          <Switch id="rule-amount" defaultChecked />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="rule-device">Device Fingerprinting</Label>
                            <p className="text-sm text-muted-foreground">
                              Flag when transactions come from new or suspicious devices
                            </p>
                          </div>
                          <Switch id="rule-device" defaultChecked />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="rule-ip">IP Address Verification</Label>
                            <p className="text-sm text-muted-foreground">
                              Flag transactions from known proxy/VPN/TOR exit nodes
                            </p>
                          </div>
                          <Switch id="rule-ip" defaultChecked />
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">AI Model Configuration</h3>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="model-learning">Continuous Learning</Label>
                          <p className="text-sm text-muted-foreground">
                            Allow the AI model to learn from new transaction patterns
                          </p>
                        </div>
                        <Switch id="model-learning" defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="model-feedback">Manual Review Feedback</Label>
                          <p className="text-sm text-muted-foreground">
                            Incorporate feedback from manual reviews into the model
                          </p>
                        </div>
                        <Switch id="model-feedback" defaultChecked />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
          
          <TabsContent value="monitoring">
            <motion.div variants={itemVariants}>
              <Card className="glassmorphism-dark">
                <CardHeader>
                  <CardTitle>Real-time Monitoring</CardTitle>
                  <CardDescription>
                    Configure real-time fraud monitoring settings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Dashboard Display</h3>
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="display-flagged">Show Flagged Transactions</Label>
                            <p className="text-sm text-muted-foreground">
                              Display recently flagged transactions on the dashboard
                            </p>
                          </div>
                          <Switch id="display-flagged" defaultChecked />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="display-chart">Risk Score Charts</Label>
                            <p className="text-sm text-muted-foreground">
                              Show risk score distribution charts on the dashboard
                            </p>
                          </div>
                          <Switch id="display-chart" defaultChecked />
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Transaction Logging</h3>
                      
                      <div className="space-y-2">
                        <Label htmlFor="log-retention">Log Retention Period (days)</Label>
                        <Input 
                          id="log-retention"
                          type="number"
                          defaultValue="90"
                          min="30"
                          max="365"
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="log-detailed">Detailed Logs</Label>
                          <p className="text-sm text-muted-foreground">
                            Store detailed transaction attributes in fraud logs
                          </p>
                        </div>
                        <Switch id="log-detailed" defaultChecked />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
          
          <TabsContent value="alerts">
            <motion.div variants={itemVariants}>
              <Card className="glassmorphism-dark">
                <CardHeader>
                  <CardTitle>Alert Settings</CardTitle>
                  <CardDescription>
                    Configure how you get notified of potential fraud
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Notification Methods</h3>
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="alert-email">Email Alerts</Label>
                            <p className="text-sm text-muted-foreground">
                              Send email notifications for high-risk transactions
                            </p>
                          </div>
                          <Switch id="alert-email" defaultChecked />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="alert-sms">SMS Alerts</Label>
                            <p className="text-sm text-muted-foreground">
                              Send text message alerts for critical fraud events
                            </p>
                          </div>
                          <Switch id="alert-sms" defaultChecked />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="alert-dashboard">Dashboard Alerts</Label>
                            <p className="text-sm text-muted-foreground">
                              Show real-time alerts in the admin dashboard
                            </p>
                          </div>
                          <Switch id="alert-dashboard" defaultChecked />
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Alert Recipients</h3>
                      
                      <div className="space-y-2">
                        <Label htmlFor="alert-emails">Email Recipients</Label>
                        <Input 
                          id="alert-emails"
                          defaultValue="admin@fluxpay.com, security@fluxpay.com"
                          placeholder="Enter comma-separated email addresses"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="alert-phones">SMS Recipients</Label>
                        <Input 
                          id="alert-phones"
                          defaultValue="+1234567890"
                          placeholder="Enter comma-separated phone numbers"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Alert Conditions</h3>
                      
                      <div className="space-y-2">
                        <Label htmlFor="alert-threshold">
                          Minimum Risk Score for Alerts: {90}%
                        </Label>
                        <Slider 
                          id="alert-threshold"
                          defaultValue={[90]} 
                          min={50} 
                          max={100} 
                          step={5}
                          className="py-4"
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="alert-batch">Batch Alerts</Label>
                          <p className="text-sm text-muted-foreground">
                            Group multiple alerts into a single notification
                          </p>
                        </div>
                        <Switch id="alert-batch" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </motion.div>
      </Tabs>
    </div>
  );
}