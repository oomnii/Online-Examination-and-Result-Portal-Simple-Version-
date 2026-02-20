// Question Bank for Multiple Subjects/Tests
// Structure: TESTS[testId] = { name, durationSeconds, questions: [{q,o,a}] }

window.TESTS = {
  DSA: {
    name: "DSA (Data Structures & Algorithms)",
    durationSeconds: 10 * 60,
    questions: [
      { q: "Binary Search complexity?", o: ["O(n)", "O(log n)", "O(n log n)", "O(1)"], a: "O(log n)" },
      { q: "FIFO structure?", o: ["Stack", "Queue", "Tree", "Graph"], a: "Queue" },
      { q: "LIFO structure?", o: ["Queue", "Stack", "Array", "Heap"], a: "Stack" },
      { q: "Worst case Quick Sort?", o: ["O(n²)", "O(n log n)", "O(n)", "O(log n)"], a: "O(n²)" },
      { q: "Left-Root-Right traversal?", o: ["Preorder", "Inorder", "Postorder", "Level order"], a: "Inorder" },
      { q: "Recursion uses which structure internally?", o: ["Queue", "Stack", "Heap", "Tree"], a: "Stack" },
      { q: "Array access time complexity?", o: ["O(1)", "O(n)", "O(log n)", "O(n log n)"], a: "O(1)" },
      { q: "Shortest path algorithm (weighted graph, non-negative weights)?", o: ["DFS", "BFS", "Dijkstra", "Binary Search"], a: "Dijkstra" },
      { q: "Priority Queue is best implemented using?", o: ["Heap", "Stack", "Array", "Linked List"], a: "Heap" },
      { q: "Merge Sort uses which technique?", o: ["Divide & Conquer", "Greedy", "Dynamic Programming", "Backtracking"], a: "Divide & Conquer" },
      { q: "Binary Search works on:", o: ["Sorted Array", "Unsorted Array", "Stack", "Queue"], a: "Sorted Array" },
      { q: "Linear Search time complexity (worst case)?", o: ["O(1)", "O(log n)", "O(n)", "O(n log n)"], a: "O(n)" }
    ]
  },

  OS: {
    name: "Operating Systems (OS)",
    durationSeconds: 10 * 60,
    questions: [
      { q: "Which scheduling algorithm may cause starvation?", o: ["FCFS", "SJF", "Round Robin", "FIFO"], a: "SJF" },
      { q: "A process in 'ready' state is:", o: ["Executing", "Waiting for I/O", "Waiting for CPU", "Terminated"], a: "Waiting for CPU" },
      { q: "Deadlock necessary condition (one of them) is:", o: ["Preemption", "Circular wait", "Paging", "Caching"], a: "Circular wait" },
      { q: "Thrashing is related to:", o: ["CPU scheduling", "Page replacement", "Excessive paging", "Disk formatting"], a: "Excessive paging" },
      { q: "Context switch happens when:", o: ["CPU changes process", "Disk changes sector", "RAM changes size", "Compiler optimizes"], a: "CPU changes process" },
      { q: "Semaphore is used for:", o: ["Memory allocation", "Process synchronization", "File compression", "Packet routing"], a: "Process synchronization" },
      { q: "Page fault occurs when:", o: ["CPU cache miss", "Referenced page not in memory", "Disk full", "Kernel panic"], a: "Referenced page not in memory" },
      { q: "In Round Robin, time quantum too small leads to:", o: ["Less context switches", "More context switches", "No preemption", "Deadlock"], a: "More context switches" },
      { q: "Belady's anomaly is seen in:", o: ["LRU", "Optimal", "FIFO", "Clock"], a: "FIFO" },
      { q: "Critical section problem is solved by ensuring:", o: ["Mutual exclusion", "Disk scheduling", "Virtualization", "Spooling"], a: "Mutual exclusion" },
      { q: "Which is NOT a state of a process?", o: ["New", "Ready", "Running", "Compiled"], a: "Compiled" },
      { q: "A 'system call' is used to:", o: ["Call a function in C", "Request OS services", "Start BIOS", "Overclock CPU"], a: "Request OS services" }
    ]
  },

  DBMS: {
    name: "DBMS (Database Management Systems)",
    durationSeconds: 10 * 60,
    questions: [
      { q: "Which normal form removes partial dependency?", o: ["1NF", "2NF", "3NF", "BCNF"], a: "2NF" },
      { q: "A primary key:", o: ["Can be NULL", "Uniquely identifies a row", "Must be composite", "Is always foreign key"], a: "Uniquely identifies a row" },
      { q: "ACID property 'I' stands for:", o: ["Isolation", "Indexing", "Integrity", "Iteration"], a: "Isolation" },
      { q: "SQL command to remove a table definition is:", o: ["DELETE", "DROP", "TRUNCATE", "REMOVE"], a: "DROP" },
      { q: "Which join returns only matching rows?", o: ["LEFT JOIN", "RIGHT JOIN", "INNER JOIN", "FULL JOIN"], a: "INNER JOIN" },
      { q: "Indexing generally improves:", o: ["Insert speed", "Search speed", "Storage usage", "Network latency"], a: "Search speed" },
      { q: "A foreign key:", o: ["References primary key of another table", "Must be unique", "Cannot repeat", "Stores password"], a: "References primary key of another table" },
      { q: "A transaction is:", o: ["Single SQL query only", "Logical unit of work", "Only a SELECT", "Only a COMMIT"], a: "Logical unit of work" },
      { q: "Which is a DDL command?", o: ["INSERT", "UPDATE", "CREATE", "SELECT"], a: "CREATE" },
      { q: "Which isolation level allows dirty reads?", o: ["Serializable", "Repeatable Read", "Read Committed", "Read Uncommitted"], a: "Read Uncommitted" },
      { q: "Normalization helps to reduce:", o: ["Redundancy", "CPU usage", "Internet speed", "RAM size"], a: "Redundancy" },
      { q: "In ER model, an attribute that can have multiple values is:", o: ["Simple", "Composite", "Multivalued", "Derived"], a: "Multivalued" }
    ]
  },

  CN: {
    name: "Computer Networks (CN)",
    durationSeconds: 10 * 60,
    questions: [
      { q: "Which protocol is used for reliable transport?", o: ["UDP", "TCP", "ICMP", "ARP"], a: "TCP" },
      { q: "HTTP typically runs on port:", o: ["21", "53", "80", "443"], a: "80" },
      { q: "DNS is used for:", o: ["File transfer", "Name resolution", "Encryption", "Routing"], a: "Name resolution" },
      { q: "Which device works at Network Layer?", o: ["Hub", "Switch", "Router", "Repeater"], a: "Router" },
      { q: "IPv4 address length is:", o: ["32 bits", "64 bits", "128 bits", "16 bits"], a: "32 bits" },
      { q: "Which is NOT part of TCP 3-way handshake?", o: ["SYN", "SYN-ACK", "ACK", "FIN"], a: "FIN" },
      { q: "MAC addresses are used at:", o: ["Application layer", "Transport layer", "Data Link layer", "Session layer"], a: "Data Link layer" },
      { q: "A private IP range example is:", o: ["8.8.8.8", "192.168.1.1", "1.1.1.1", "172.200.1.1"], a: "192.168.1.1" },
      { q: "Which protocol maps IP to MAC?", o: ["DNS", "ARP", "RARP", "DHCP"], a: "ARP" },
      { q: "Ping uses:", o: ["TCP", "UDP", "ICMP", "HTTP"], a: "ICMP" },
      { q: "In OSI model, encryption is typically at:", o: ["Physical", "Presentation", "Network", "Data Link"], a: "Presentation" },
      { q: "Which is a routing protocol?", o: ["RIP", "FTP", "SMTP", "SNMP"], a: "RIP" }
    ]
  }
};

window.getSelectedTestId = function(){
  const id = localStorage.getItem("selectedTest") || "DSA";
  return window.TESTS && window.TESTS[id] ? id : "DSA";
};

window.getSelectedTest = function(){
  const id = window.getSelectedTestId();
  return window.TESTS[id];
};

// Load custom quizzes from localStorage and merge with built-in tests
(function loadCustomQuizzes(){
  try {
    const customQuizzes = JSON.parse(localStorage.getItem('customQuizzes') || '{}');
    if(customQuizzes && typeof customQuizzes === 'object'){
      Object.assign(window.TESTS, customQuizzes);
    }
  } catch(e){
    console.error('Error loading custom quizzes:', e);
  }
})();
