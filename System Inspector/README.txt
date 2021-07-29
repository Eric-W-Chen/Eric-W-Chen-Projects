System Inspector (v 1.0)

Implemented a Unix utility that inspects the system it runs on and creates a summarized report for the user. If you’ve ever used the top command from a shell, our program will be somewhat similar. To give you an idea of how this program will work, here’s a quick example:

Hostname: snuggly-bunny | Kernel Version: 5.4.15
CPU: AMD EPYC Processor (with IBPB), Processing Units: 2
Uptime: 3 days, 23 hours, 51 minutes, 19 seconds

Load Average (1/5/15 min): 0.05 0.02 0.00
CPU Usage:    [######--------------] 30.0%
Memory Usage: [##################--] 90.6% (14.5 / 16.0 GB)

Tasks: 101 total
2 running, 0 waiting, 98 sleeping, 1 stopped, 0 zombie

      PID |                 Task Name |        State |            User
----------+---------------------------+--------------+-----------------
     9783 |                      sshd |      running |            root
    11642 |                       top |      stopped |       mmalensek
    12701 |                 inspector |      running |       mmalensek
    
    
To get this information, you will use the proc, the process information pseudo-filesystem. While there are other ways to get the information displayed above, you are restricted to using proc in this assignment. There are two great resources for finding out what information is available in proc:

Simply cd /proc in your shell and then run ls to view the files. You’ll see process IDs and several other virtual files that are updated dynamically with system information. Each line shown above in the process listing corresponds to a numbered directory in /proc.
Check out the man page: man procfs. (If this doesn’t work, you probably need to install the man pages: pacman -Sy man-pages). The manual has a complete description of every file and directory stored under /proc.
For a quick example, try running cat /proc/uptime. You’ll see the number of seconds the system has been running printed to the terminal.

In this project, we worked with:
• The open(), read(), and close() system calls for reading file data
• Tokenizing text files
• opendir and readdir functions for listing directory contents
• Argument parsing with getopt
• Load averages, calculating CPU usage, and Linux tasks
• Text-based UIs with ncurses

The program supports a few command line options. We’ll let the program do the talking by printing usage information (-h option):

[magical-unicorn:~/P1-malensek]$ ./inspector -h
Usage: ./inspector [-ho] [-i interval] [-p procfs_dir]

Options:
    * -h              Display help/usage information
    * -i interval     Set the update interval (default: 1000ms)
    * -p procfs_dir   Set the expected procfs mount point (default: /proc)
    * -o              Operate in one-shot mode (no curses or live updates)
Pay particular attention to the -p flag. This allows us to change the directory where proc is mounted (/proc by default). We will use this option to test your code with our own pre-populated copy of proc.

Populating the Output
The main priority in this project is implementing a variety of procfs-related functions (prefixed pfs_*) to retrieve the required information. The UI for the program was written using the ncurses library – assuming your pfs_* functions work properly. In ‘one-shot’ mode, the simple UI is disabled and printed directly to the terminal instead.

Uptime
When calculating uptime, don’t report years, days, or hours if their respective values are 0. If a machine has just booted up, you’ll display Uptime: 0 minutes, 42 seconds, for example (note that we’re only showing the minutes and seconds fields). The fields you need to support are:

• Years
• Days
• Hours
• Minutes
• Seconds
• CPU Usage
• CPU usage is calculated by sampling over a period of time, i.e., the CPU was active for 70% of one second. You will record the CPU usage, sleep for one second (this is handled by the UI code), and then get a second reading to determine the usage percentage. The CPU metrics in /proc/stat will add up to 100% because idle time is included. You’ll need to track idle time separately, so the calculation will look something like:

1 - ( (idle2 - idle1) / (total2 - total1) )

If the CPU usage percentage is NaN (not a number), or you encounter errors performing the calculation, report 0%. Since this calculation requires two samples, your function should take the previous sample as one of its arguments.

Process States
The program should support all of the process states listed in the proc man pages. Additionally, for our purposes, we will consider ‘idle’ processes equivalent to ‘sleeping.’ To build the “running, waiting, sleeping, …” output, the specific state flags you’ll be interested in are R, S, I, D, Z, T, and t.

Idle and sleeping processes are not shown in the program output.

UIDs
You’ll notice that proc doesn’t contain information about the username associated with running processes, but it does provide their ID numbers (UIDs). To map UIDs to usernames, you will need to parse the contents of /etc/passwd. While there are functions that will do this for you, such as getpwuid, you are required to build your own lookup functionality. (Note: getpwuid can seemingly leak memory in certain situations, so we’re avoiding it here).

Implementation Restrictions
Restrictions: may use any standard C library functionality. External libraries are not allowed unless permission is granted in advance. Your code must compile and run on your VM set up with Arch Linux as described in class – failure to do so will receive a grade of 0.

While there are several ways to retrieve the system information displayed by your project, we retrieve the data from /proc only.

One of the major components of this assignment is reading and parsing text files. To read the files, we use the read system call instead of the fancier C library functions like fgets, getline, scanf, etc. You also shouldn’t use getpwuid or strtok.

Rationale: we’re using read here to get familiar with how I/O works at a lower level. You will need to be able to understand read for subsequent assignments. As for strtok, it has several pitfalls (including not being reentrant or thread safe) that make it a bad choice. You can either use strsep or the next_token implementation provided in class.
