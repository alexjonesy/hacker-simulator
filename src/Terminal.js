import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import './Terminal.css';

const TUTORIAL_ASCII = `
████████╗██╗   ██╗████████╗ ██████╗ ██████╗ ██╗ █████╗ ██╗     
╚══██╔══╝██║   ██║╚══██╔══╝██╔═══██╗██╔══██╗██║██╔══██╗██║     
   ██║   ██║   ██║   ██║   ██║   ██║██████╔╝██║███████║██║     
   ██║   ██║   ██║   ██║   ██║   ██║██╔══██╗██║██╔══██║██║     
   ██║   ╚██████╔╝   ██║   ╚██████╔╝██║  ██║██║██║  ██║███████╗
   ╚═╝    ╚═════╝    ╚═╝    ╚═════╝ ╚═╝  ╚═╝╚═╝╚═╝  ╚═╝╚══════╝
`;

const MISSION_ASCII = `
███╗   ███╗██╗███████╗███████╗██╗ ██████╗ ███╗   ██╗
████╗ ████║██║██╔════╝██╔════╝██║██╔═══██╗████╗  ██║
██╔████╔██║██║███████╗███████╗██║██║   ██║██╔██╗ ██║
██║╚██╔╝██║██║╚════██║╚════██║██║██║   ██║██║╚██╗██║
██║ ╚═╝ ██║██║███████║███████║██║╚██████╔╝██║ ╚████║
╚═╝     ╚═╝╚═╝╚══════╝╚══════╝╚═╝ ╚═════╝ ╚═╝  ╚═══╝
██████╗ ██████╗ ██╗███████╗███████╗██╗███╗   ██╗ ██████╗ 
██╔══██╗██╔══██╗██║██╔════╝██╔════╝██║████╗  ██║██╔════╝ 
██████╔╝██████╔╝██║█████╗  █████╗  ██║██╔██╗ ██║██║  ███╗
██╔══██╗██╔══██╗██║██╔══╝  ██╔══╝  ██║██║╚██╗██║██║   ██║
██████╔╝██║  ██║██║███████╗██║     ██║██║ ╚████║╚██████╔╝
╚═════╝ ╚═╝  ╚═╝╚═╝╚══════╝╚═╝     ╚═╝╚═╝  ╚═══╝ ╚═════╝ 
`;

function Terminal() {
  // All your state declarations
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([]);
  const [target, setTarget] = useState({
    domain: 'tutorial-target.com',
    ip: '192.168.1.100'
  });
  const [phase, setPhase] = useState('TUTORIAL');
  const [systemState, setSystemState] = useState({
    connected: false,
    scanComplete: false,
    vulnerabilitiesFound: [],
    exploited: false,
    filesDownloaded: [],
    accessLevel: 'none'
  });
  const [currentDirectory, setCurrentDirectory] = useState('/');
  const [fileSystem, setFileSystem] = useState({});
  const [targetFiles, setTargetFiles] = useState([]);
  const [missionBriefing, setMissionBriefing] = useState({
    company: 'TutorialCorp',
    type: 'tutorial',
    objective: 'Complete the tutorial mission',
    target: 'training data'
  });
  const [missionComplete, setMissionComplete] = useState(false);
  const [tutorial, setTutorial] = useState({ step: 0, completed: false });
  const [showSkipButton, setShowSkipButton] = useState(true);
  const [showBriefingButton, setShowBriefingButton] = useState(false);
  const [vulnerablePort, setVulnerablePort] = useState(null);
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const terminalRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // Add this useEffect for initial tutorial setup
  useEffect(() => {
    // Set initial file system
    setFileSystem(FILE_SYSTEM);
    
    // Set initial tutorial history
    setHistory([
      { type: 'ascii', content: TUTORIAL_ASCII },
      { type: 'system', content: '=== WELCOME TO CYBER ATTACK SIMULATOR v1.0 ===' },
      { type: 'system', content: 'This tutorial will guide you through basic hacking techniques.' },
      { type: 'system', content: 'Target System Information:' },
      { type: 'info', content: `Domain: ${target.domain}` },
      { type: 'info', content: `IP: ${target.ip}` },
      { type: 'system', content: tutorialSteps[0].message },
      { type: 'task', content: tutorialSteps[0].task }
    ]);
  }, []); // Empty dependency array means this runs once when component mounts

  // Constants for mission generation
  const MISSION_TYPES = [
    {
      type: 'corporate',
      targets: ['financial records', 'trade secrets', 'employee data', 'research documents', 'merger plans'],
      companies: ['TechCorp', 'GlobalFinance', 'MegaCorp', 'InnovaTech', 'DataDynamics']
    },
    {
      type: 'government',
      targets: ['classified documents', 'surveillance data', 'security protocols', 'personnel files', 'operation plans'],
      companies: ['GovSec', 'DefenceSystems', 'SecureNet', 'CyberCommand', 'IntelBase']
    }
  ];

  // File system structure
  const FILE_SYSTEM = {
    '/': {
      'home': {
        'admin': {
          'documents': {
            'meeting_notes.txt': 'Regular staff meeting notes - Discussion about new security protocols.',
            'budget_2024.xlsx': 'Financial projections and budget allocations for next year.',
            'project_titan.pdf': 'Confidential: Details of Project Titan - Next-gen quantum computing research.'
          },
          'downloads': {
            'software_updates.zip': 'System update packages and security patches.',
            'backup_configs.tar': 'Backup of system configuration files.'
          }
        },
        'user': {
          'personal': {
            'todo.txt': 'Remember to update security credentials next week.',
            'contacts.csv': 'Internal staff directory and contact information.'
          }
        }
      },
      'var': {
        'log': {
          'system.log': 'System event logs and error messages from the past week.',
          'security.log': 'Security audit logs showing access attempts and user activities.'
        }
      },
      'etc': {
        'config': {
          'security.conf': 'Network security configuration settings and access rules.',
          'users.db': 'User authentication database and permission levels.'
        }
      },
      'secret': {
        'classified': {
          'trade_secrets.doc': 'Detailed specifications of proprietary technology and trade secrets.',
          'research_data.pdf': 'Confidential research findings and experimental results.',
          'customer_data.csv': 'Sensitive customer information and transaction records.'
        }
      }
    }
  };

  // Tutorial steps
  const tutorialSteps = [
    {
      message: "Welcome to the Cyber Attack Simulator. Let's begin with basic reconnaissance.",
      task: "First, let's gather information about the target system. Type 'whois' to start.",
      command: 'whois'
    },
    {
      message: "Good work! The WHOIS lookup revealed basic information about our target.",
      task: "Now let's scan for open ports. Type 'nmap' to scan the target system.",
      command: 'nmap'
    },
    {
      message: "Excellent! We found some open ports. Let's check port 80 for vulnerabilities.",
      task: "Use 'scan-vuln 80' to scan port 80 for vulnerabilities.",
      command: 'scan-vuln 80'
    },
    {
      message: "We found a vulnerability! Let's analyse it in detail.",
      task: "Type 'analyse' to get detailed information about the vulnerability.",
      command: 'analyse'
    },
    {
      message: "Now that we understand the vulnerability, let's exploit it.",
      task: "Type 'exploit buffer-overflow 80' to attempt to gain access to the system.",
      command: 'exploit buffer-overflow 80'
    }
  ];

  // Update the whois command
  const baseCommands = {
    help: () => ({
      type: 'info',
      content: [
        { text: '=== Available Commands ===', delay: 200 },
        { text: 'Basic Commands:', delay: 100 },
        { text: 'help        - Show this help message', delay: 50 },
        { text: 'clear       - Clear terminal screen', delay: 50 },
        { text: '', delay: 50 },
        { text: 'Reconnaissance Commands:', delay: 100 },
        { text: 'whois       - Lookup domain information of target', delay: 50 },
        { text: 'nmap        - Scan target system for open ports', delay: 50 },
        { text: 'scan-vuln   - Scan specific port for vulnerabilities (usage: scan-vuln <port>)', delay: 50 },
        { text: '', delay: 50 },
        { text: 'Exploitation Commands:', delay: 100 },
        { text: 'analyse     - Analyse discovered vulnerabilities', delay: 50 },
        { text: 'exploit     - Exploit vulnerability (usage: exploit <type> <port>)', delay: 50 },
        { text: '', delay: 50 },
        { text: 'File System Commands:', delay: 100 },
        { text: 'ls          - List files in current directory', delay: 50 },
        { text: 'cd          - Change directory (usage: cd <directory>)', delay: 50 },
        { text: 'pwd         - Show current directory path', delay: 50 },
        { text: 'cat         - View file contents (usage: cat <filename>)', delay: 50 },
        { text: 'download    - Download/exfiltrate file (usage: download <filename>)', delay: 50 },
        { text: '', delay: 50 },
        { text: 'Mission Commands:', delay: 100 },
        { text: 'start       - Start a new mission', delay: 50 },
        { text: '', delay: 50 },
        { text: '=== End of Help ===', delay: 200 }
      ]
    }),
    whois: () => {
      // Special handling for tutorial mode
      if (!tutorial.completed) {
        return {
          type: 'info',
          content: [
            { text: '=== WHOIS Lookup Results ===', delay: 200 },
            { text: `Domain Name: ${target.domain}`, delay: 200 },
            { text: 'Registrar: ICANN', delay: 200 },
            { text: 'Organization: TutorialCorp', delay: 200 },
            { text: `IP Address: ${target.ip}`, delay: 200 },
            { text: 'Status: Active', delay: 200 },
            { text: '=== End of WHOIS Data ===', delay: 200 }
          ]
        };
      }

      // Normal mission mode
      if (!missionBriefing) {
        return {
          type: 'error',
          content: [{ text: 'No active mission. Start a mission first.', delay: 100 }]
        };
      }

      return {
        type: 'info',
        content: [
          { text: `Domain Name: ${target.domain}`, delay: 200 },
          { text: `Registrar: ICANN`, delay: 200 },
          { text: `Organization: ${missionBriefing.company}`, delay: 200 },
          { text: `IP Address: ${target.ip}`, delay: 200 },
          { text: 'Status: Active', delay: 200 }
        ]
      };
    },

    nmap: () => {
      const ports = [
        { port: 80, service: 'http', version: 'Apache/2.4.41' },
        { port: 443, service: 'https', version: 'nginx/1.18.0' },
        { port: 22, service: 'ssh', version: 'OpenSSH/8.2p1' },
        { port: 21, service: 'ftp', version: 'vsftpd 3.0.3' }
      ];

      // Randomly select one port to be vulnerable
      const vulnerablePort = ports[Math.floor(Math.random() * ports.length)];
      setVulnerablePort(vulnerablePort.port);

      setSystemState(prev => ({
        ...prev,
        scanComplete: true,
        openPorts: ports.map(p => p.port)
      }));

      return {
        type: 'scan',
        content: [
          { text: `Initiating Nmap scan of ${target.ip}...`, delay: 300 },
          { text: 'Scanning for open ports...', delay: 1000 },
          ...ports.map(port => ({
            text: `[+] Port ${port.port} (${port.service}) is open - ${port.version}`,
            delay: 200
          })),
          { text: 'Scan completed. Use scan-vuln <port> to check for vulnerabilities.', delay: 300 }
        ]
      };
    },

    'scan-vuln': (args) => {
      if (!systemState.scanComplete) {
        return {
          type: 'error',
          content: [{ text: 'Error: Must complete port scan first (use "nmap")', delay: 100 }]
        };
      }

      if (!args || !args[0]) {
        return {
          type: 'error',
          content: [{ text: 'Usage: scan-vuln <port>', delay: 100 }]
        };
      }

      const targetPort = parseInt(args[0]);
      
      if (!systemState.openPorts.includes(targetPort)) {
        return {
          type: 'error',
          content: [{ text: `Error: Port ${targetPort} is not open or was not found in scan results`, delay: 100 }]
        };
      }

      if (targetPort === vulnerablePort) {
        const vuln = {
          port: targetPort,
          type: 'Buffer Overflow',
          severity: 'HIGH',
          description: 'Remote code execution vulnerability detected'
        };

        setSystemState(prev => ({
          ...prev,
          vulnerabilitiesFound: [...prev.vulnerabilitiesFound, vuln]
        }));

        setPhase('EXPLOITATION');

        return {
          type: 'warning',
          content: [
            { text: `Scanning port ${targetPort}...`, delay: 500 },
            { text: '[!] Critical vulnerability found!', delay: 1000 },
            { text: `Type: Buffer Overflow`, delay: 200 },
            { text: `Severity: HIGH`, delay: 200 },
            { text: 'Use "analyse" for more details.', delay: 200 }
          ]
        };
      }

      return {
        type: 'info',
        content: [
          { text: `Scanning port ${targetPort}...`, delay: 500 },
          { text: `[+] Port ${targetPort} scan complete`, delay: 500 },
          { text: 'No vulnerabilities found on this port.', delay: 200 }
        ]
      };
    },

    analyse: () => {
      if (systemState.vulnerabilitiesFound.length === 0) {
        return {
          type: 'error',
          content: [{ text: 'No vulnerabilities found yet. Use "scan-vuln" with a port number.', delay: 100 }]
        };
      }

      return {
        type: 'info',
        content: systemState.vulnerabilitiesFound.flatMap(vuln => [
          { text: '=== Vulnerability Analysis ===', delay: 200 },
          { text: `Port: ${vuln.port}`, delay: 200 },
          { text: `Type: ${vuln.type}`, delay: 200 },
          { text: `Severity: ${vuln.severity}`, delay: 200 },
          { text: vuln.description, delay: 200 },
          { text: 'Use "exploit" to attempt exploitation', delay: 200 }
        ])
      };
    },

    exploit: (args) => {
      if (systemState.vulnerabilitiesFound.length === 0) {
        return {
          type: 'error',
          content: [{ text: 'No vulnerabilities found to exploit. Use "scan-vuln" first.', delay: 100 }]
        };
      }

      if (!args || args.length < 2) {
        return {
          type: 'error',
          content: [
            { text: 'Usage: exploit <vulnerability-type> <port>', delay: 100 },
            { text: 'Example: exploit buffer-overflow 80', delay: 100 },
            { text: 'Hint: Use "analyse" to view vulnerability details', delay: 100 }
          ]
        };
      }

      const vulnType = args[0].toLowerCase();
      const targetPort = parseInt(args[1]);

      const foundVuln = systemState.vulnerabilitiesFound.find(v => 
        v.port === targetPort && 
        v.type.toLowerCase().replace(' ', '-') === vulnType
      );

      if (!foundVuln) {
        return {
          type: 'error',
          content: [
            { text: `Error: No ${vulnType} vulnerability found on port ${targetPort}`, delay: 100 },
            { text: 'Use "analyse" to view available vulnerabilities', delay: 100 }
          ]
        };
      }

      setSystemState(prev => ({
        ...prev,
        exploited: true,
        accessLevel: 'root'
      }));

      setPhase('EXFILTRATION');

      return {
        type: 'success',
        content: [
          { text: 'Launching exploit...', delay: 500 },
          { text: `Targeting ${foundVuln.type} vulnerability on port ${targetPort}...`, delay: 500 },
          { text: 'Crafting payload...', delay: 500 },
          { text: 'Executing exploit...', delay: 1000 },
          { text: '[+] Buffer overflow successful!', delay: 500 },
          { text: '[+] Spawning shell...', delay: 500 },
          { text: '[+] Escalating privileges...', delay: 500 },
          { text: '[+] Root access achieved', delay: 500 },
          { text: 'Navigate the system using: ls, cd, cat', delay: 300 },
          { text: 'Download sensitive files using: download <filename>', delay: 300 }
        ]
      };
    },

    clear: () => {
      setHistory([]);
      return { type: 'clear', content: [] };
    }
  };

  // File system commands
  const fileSystemCommands = {
    ls: () => {
      const current = getCurrentDirectory();
      if (!current) {
        return {
          type: 'error',
          content: [{ text: 'Invalid directory', delay: 100 }]
        };
      }

      const entries = Object.entries(current).map(([name, content]) => ({
        text: typeof content === 'object' ? `📁 ${name}/` : `📄 ${name}`,
        delay: 50
      }));

      return {
        type: 'info',
        content: entries.length ? entries : [{ text: 'Empty directory', delay: 100 }]
      };
    },

    cd: (args) => {
      if (!args || !args[0]) {
        setCurrentDirectory('/');
        return {
          type: 'info',
          content: [{ text: 'Changed to root directory', delay: 100 }]
        };
      }

      const newPath = resolveNewPath(args[0]);
      let current = fileSystem['/'];
      const parts = newPath.split('/').filter(Boolean);

      for (const part of parts) {
        if (!current[part] || typeof current[part] !== 'object') {
          return {
            type: 'error',
            content: [{ text: 'Invalid directory', delay: 100 }]
          };
        }
        current = current[part];
      }

      setCurrentDirectory(newPath);
      return {
        type: 'info',
        content: [{ text: `Changed to ${newPath || '/'}`, delay: 100 }]
      };
    },

    pwd: () => ({
      type: 'info',
      content: [{ text: currentDirectory || '/', delay: 100 }]
    }),

    cat: (args) => {
      if (!args || !args[0]) {
        return {
          type: 'error',
          content: [{ text: 'Usage: cat <filename>', delay: 100 }]
        };
      }

      const current = getCurrentDirectory();
      if (!current || !current[args[0]]) {
        return {
          type: 'error',
          content: [{ text: 'File not found', delay: 100 }]
        };
      }

      if (typeof current[args[0]] === 'object') {
        return {
          type: 'error',
          content: [{ text: 'Is a directory', delay: 100 }]
        };
      }

      return {
        type: 'info',
        content: [
          { text: '=== File Contents ===', delay: 100 },
          { text: current[args[0]], delay: 200 },
          { text: '==================', delay: 100 }
        ]
      };
    },

    download: (args) => {
      if (!systemState.exploited) {
        return {
          type: 'error',
          content: [{ text: 'Error: System access required. Must exploit vulnerability first.', delay: 100 }]
        };
      }

      if (!args || !args[0]) {
        return {
          type: 'error',
          content: [{ text: 'Usage: download <filename>', delay: 100 }]
        };
      }

      const current = getCurrentDirectory();
      if (!current || !current[args[0]]) {
        return {
          type: 'error',
          content: [{ text: 'File not found', delay: 100 }]
        };
      }

      if (targetFiles.includes(args[0])) {
        setSystemState(prev => ({
          ...prev,
          filesDownloaded: [...prev.filesDownloaded, args[0]]
        }));

        const allFilesDownloaded = targetFiles.every(file => 
          [...systemState.filesDownloaded, args[0]].includes(file)
        );

        if (allFilesDownloaded) {
          setMissionComplete(true);
        }

        return {
          type: 'success',
          content: [
            { text: 'Initiating secure file transfer...', delay: 500 },
            { text: 'Copying file contents...', delay: 1000 },
            { text: 'Download complete!', delay: 500 },
            { text: `Successfully exfiltrated: ${args[0]}`, delay: 200 },
            ...(allFilesDownloaded ? [
              { text: '=== MISSION COMPLETE ===', delay: 1000 },
              { text: 'All target files successfully retrieved.', delay: 500 },
              
            ] : [])
          ]
        };
      }

      return {
        type: 'info',
        content: [
          { text: 'File downloaded, but this does not appear to be the target data.', delay: 100 },
          { text: 'Continue searching for sensitive files.', delay: 100 }
        ]
      };
    }
  };

  // Combine all commands
  const commandOutputs = {
    ...baseCommands,
    ...fileSystemCommands,
    'next-mission': () => {
      setMissionComplete(false);
      startMission();
      return {
        type: 'system',
        content: [{ text: 'Starting next mission...', delay: 200 }]
      };
    },
  };

  // Command handling
  const handleCommand = async (e) => {
    if (e.key !== 'Enter') return;
    e.preventDefault();

    const fullCommand = input.trim().toLowerCase();
    if (fullCommand) {
      setCommandHistory(prev => [...prev, fullCommand]);
      setHistoryIndex(-1);
    }

    const [cmd, ...args] = fullCommand.split(' ');
    
    setHistory(prev => [...prev, { type: 'input', content: `> ${input}` }]);
    setInput('');

    if (!tutorial.completed) {
      // Tutorial mode command handling
      const currentStep = tutorialSteps[tutorial.step];
      const expectedCommand = typeof currentStep.command === 'function' 
        ? currentStep.command(systemState) 
        : currentStep.command;

      if (cmd === 'scan-vuln') {
        // Special handling for scan-vuln during tutorial
        const port = parseInt(args[0]);
        if (port === 80) { // Force port 80 to be vulnerable during tutorial
          const vuln = {
            port: port,
            type: 'Buffer Overflow',
            severity: 'HIGH',
            description: 'Remote code execution vulnerability detected'
          };

          setSystemState(prev => ({
            ...prev,
            vulnerabilitiesFound: [...prev.vulnerabilitiesFound, vuln]
          }));

          setPhase('EXPLOITATION');

          await animateOutput([
            { text: `Scanning port ${port}...`, delay: 500 },
            { text: '[!] Critical vulnerability found!', delay: 1000 },
            { text: `Type: Buffer Overflow`, delay: 200 },
            { text: `Severity: HIGH`, delay: 200 },
            { text: 'Use "analyse" for more details.', delay: 200 }
          ]);

          // Progress tutorial
          const nextStep = tutorial.step + 1;
          if (nextStep < tutorialSteps.length) {
            setTutorial(prev => ({ ...prev, step: nextStep }));
            setHistory(prev => [
              ...prev,
              { type: 'system', content: tutorialSteps[nextStep].message },
              { type: 'task', content: tutorialSteps[nextStep].task }
            ]);
          }
          return;
        }
      }

      if (fullCommand === expectedCommand) {
        if (commandOutputs[cmd]) {
          const output = commandOutputs[cmd](args);
          await animateOutput(output.content);
        }

        const nextStep = tutorial.step + 1;
        if (nextStep < tutorialSteps.length) {
          setTutorial(prev => ({ ...prev, step: nextStep }));
          setHistory(prev => [
            ...prev,
            { type: 'system', content: tutorialSteps[nextStep].message },
            { type: 'task', content: tutorialSteps[nextStep].task }
          ]);
        } else {
          setTutorial(prev => ({ ...prev, completed: true }));
          setShowSkipButton(false);
          setShowBriefingButton(true);
          setHistory(prev => [
            ...prev,
            { type: 'success', content: 'Tutorial completed!' },
            { type: 'system', content: 'Ready to start your first mission?' },
            { type: 'system', content: 'Click the button below.' }
          ]);
        }
      } else {
        setHistory(prev => [
          ...prev,
          { type: 'error', content: 'Incorrect command. Try again.' },
          { type: 'task', content: currentStep.task }
        ]);
      }
    } else {
      // Normal mode command handling
      if (commandOutputs[cmd]) {
        const output = commandOutputs[cmd](args);
        await animateOutput(output.content);
      } else {
        setHistory(prev => [...prev, { 
          type: 'error', 
          content: `Command not found: ${cmd}. Type 'help' for available commands.`
        }]);
      }
    }
  };

  // Animation helper
  const animateOutput = async (content) => {
    for (const line of content) {
      setHistory(prev => [...prev, { type: 'output', content: line.text }]);
      await new Promise(resolve => setTimeout(resolve, line.delay));
    }
  };

  // Mission generation
  const generateMission = () => {
    const missionType = MISSION_TYPES[Math.floor(Math.random() * MISSION_TYPES.length)];
    const target = missionType.targets[Math.floor(Math.random() * missionType.targets.length)];
    const company = missionType.companies[Math.floor(Math.random() * missionType.companies.length)];
    
    const targetFileName = `${target.split(' ').join('_')}.doc`;
    const newFileSystem = JSON.parse(JSON.stringify(FILE_SYSTEM));
    const randomPath = getRandomFilePath(newFileSystem['/']);
    randomPath[targetFileName] = `Confidential ${company} ${target}. For authorised personnel only.`;

    return {
      type: missionType.type,
      company,
      target,
      objective: `Infiltrate ${company}'s network and locate their ${target}.`,
      targetFiles: [targetFileName],
      fileSystem: newFileSystem
    };
  };

  // Skip tutorial
  const skipTutorial = () => {
    setShowSkipButton(false);
    setTutorial({ step: 0, completed: true });
    setHistory([
      { type: 'system', content: '=== TUTORIAL SKIPPED ===' },
      { type: 'info', content: 'Available commands:' },
      { type: 'info', content: 'Type "help" to see all commands' },
      { type: 'info', content: 'Type "hint" if you need guidance' },
      { type: 'system', content: 'Ready to start your mission?' },
      { type: 'system', content: 'Click the button below.' }
    ]);
    setShowBriefingButton(true);
  };

  // Start mission
  const startMission = () => {
    const mission = generateMission();
    setMissionBriefing(mission);
    setFileSystem(mission.fileSystem);
    setTargetFiles(mission.targetFiles);
    setShowBriefingButton(false);
    setPhase('RECON');
    
    setTarget({
      domain: mission.company.toLowerCase().replace(/\s+/g, '') + '.com',
      ip: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`
    });
    
    setHistory([
      { type: 'ascii', content: MISSION_ASCII },
      { type: 'system', content: '=== TOP SECRET - MISSION BRIEFING ===' },
      { type: 'info', content: `Target: ${mission.company}` },
      { type: 'info', content: `Objective: ${mission.objective}` },
      { type: 'info', content: 'Mission Parameters:' },
      { type: 'info', content: '1. Gain access to target system' },
      { type: 'info', content: '2. Locate and exfiltrate sensitive data' },
      { type: 'info', content: '3. Leave no traces' },
      { type: 'system', content: 'Type "help" for available commands' },
      { type: 'system', content: '===================================' }
    ]);
  };

  // Helper functions
  const getRandomFilePath = (obj) => {
    const paths = [];
    
    const traverse = (current, path) => {
      if (typeof current !== 'object') return;
      
      paths.push(current);
      for (const key in current) {
        traverse(current[key], path.concat(key));
      }
    };
    
    traverse(obj, []);
    return paths[Math.floor(Math.random() * paths.length)];
  };

  const getCurrentDirectory = () => {
    const path = currentDirectory.split('/').filter(Boolean);
    let current = fileSystem['/'];
    for (const dir of path) {
      if (!current[dir]) return null;
      current = current[dir];
    }
    return current;
  };

  const resolveNewPath = (newPath) => {
    if (newPath.startsWith('/')) {
      return newPath;
    }

    const currentParts = currentDirectory.split('/').filter(Boolean);
    const newParts = newPath.split('/');

    for (const part of newParts) {
      if (part === '..') {
        currentParts.pop();
      } else if (part !== '.') {
        currentParts.push(part);
      }
    }

    return '/' + currentParts.join('/');
  };

  // Add this useEffect after your other useEffects
  useEffect(() => {
    // Scroll to bottom whenever history changes
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]); // Dependency on history means this runs whenever history updates

  // Add handleKeyDown function
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex + 1;
        if (newIndex < commandHistory.length) {
          setHistoryIndex(newIndex);
          setInput(commandHistory[commandHistory.length - 1 - newIndex]);
        }
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput('');
      }
    } else if (e.key === 'Enter') {
      handleCommand(e);
    }
  };

  return (
    <div className="terminal-container" onClick={() => inputRef.current?.focus()}>
      <div className="terminal-header">
        <div className="terminal-left">
          <button 
            className="home-button"
            onClick={() => navigate('/')}
          >
            HOME
          </button>
          <div className="terminal-title">CYBER ATTACK SIMULATOR v1.0</div>
        </div>
        <div className="terminal-status">
          Phase: {phase} | Target: {target.domain} ({target.ip})
        </div>
      </div>
      
      <div className="terminal-window" ref={terminalRef}>
        <AnimatePresence>
          {history.map((entry, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className={`terminal-line ${entry.type}`}
            >
              {entry.content}
            </motion.div>
          ))}
        </AnimatePresence>
        
        <div className="terminal-input-line">
          <span className="prompt">></span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            spellCheck="false"
            autoComplete="off"
          />
        </div>
      </div>

      {showSkipButton && (
        <div className="skip-button-container">
          <button 
            className="skip-button"
            onClick={skipTutorial}
          >
            Skip Tutorial
          </button>
        </div>
      )}
      {showBriefingButton && (
        <div className="briefing-button-container">
          <button 
            className="briefing-button"
            onClick={startMission}
          >
            Continue to Mission Briefing
          </button>
        </div>
      )}
      {missionComplete && (
        <div className="mission-complete-container">
          <button 
            className="next-mission-button"
            onClick={() => {
              const output = commandOutputs['next-mission']();
              animateOutput(output.content);
            }}
          >
            Start Next Mission
          </button>
        </div>
      )}
    </div>
  );
}

export default Terminal;
