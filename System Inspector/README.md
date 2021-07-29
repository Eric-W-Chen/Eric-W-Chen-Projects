# Project 1: System Inspector

Author: Eric Chen

See: https://www.cs.usfca.edu/~mmalensek/cs326/assignments/project-1.html 

## About This Project
In this project, we implemented a Unix utility that inspects the system that it runs on and creates a summarized report for the user. This is very similar to the top command, which also prints the system, hardware, tasks, and processes information in a user friendly format. This information is retrieved through system calls to read files from proc, which is a process information pseudo-filesystem.

### What is proc?
proc is the process information pseudo-filesystem. It is created on fly when system boots and is dissolved at time of system shut down. It contains useful information about the processes that are currently running and is regarded as the control and information centre for the kernel. The proc file system also provides communication medium between kernel space and user space. It is commonly mounted at /proc and is typically mounted automatically by the system, but can also be mounted manually. Most of the files in proc are read-only but some are writable, allowing kernel variables to be changed.

Source(s): 
https://www.geeksforgeeks.org/proc-file-system-linux/ 
man proc

### Program Options
Each portion of the display can be toggled with command line options. Here are the options:

```bash
$ ./inspector -h
Usage: ./inspector [-ho] [-i interval] [-p procfs_dir]

Options:
     * -h		Display help/usage information
     * -i interval	Set the update interval (default: 1000ms)
     * -p procfs_dir	Set the expected procfs mount point (default: \proc)
     * -o		Operate in one-shot mode (no curses or live updates)

```

### Included Files
There are several files included. These are:
   - <b>Makefile</b>: Including to compile and run the program.
   - <b>inspector.c</b>: The program driver
   - <b>procfs.c</b>: Includes functions to get the system information of the system. This information includes hostname, kernel version, cpu model, uptime, cpu usage, number of processing units, load average, memory usage, and number of active processes and their states.
   - <b>util.c</b>: Includes function to display visual progress bar for memory usage and cpu usage, as well as a function to convert uid into a username and maps the uid with the username..    - <b>display.c</b>: Includes function to build user-friendly output for user.

There are also header files for each of these files.


To compile and run:

```bash
make
./inspector
```


### Program Output
```bash
$ ./inspector

System Information
------------------
Hostname: Erics-VM | Kernel Version: 5.4.13
CPU: AMD EPYC Processor (with IBPD), Processing Units: 2
Uptime: 13 days, 22 hours, 56 minutes, 9 seconds

Load Average (1/5/15 min): 0.03 0.01 0.00
CPU Usage:	[--------------------] 1.9%
Memory Usage:	[########------------] 41.6% (0.4 / 1.0 GB)

Tasks: 90 total
1 running, 0 waiting, 89 sleeping, 0 stopped, 0 zombie

  PID |    Task Name |                     State |            User 
------+--------------+---------------------------+-----------------
123325|    inspector |                   running |            root     

```

## Testing

To execute the test cases, use `make test`. To pull in updated test cases, run `make testupdate`. You can also run a specific test case instead of all of them:

```
# Run all test cases:
make test

# Run a specific test case:
make test run=4

# Run a few specific test cases (4, 8, and 12 in this case):
make test run='4 8 12'
```
./inspector
```

## Testing

To execute the test cases, use `make test`. To pull in updated test cases, run `make testupdate`. You can also run a specific test case instead of all of them:

```
# Run all test cases:
make test

# Run a specific test case:
make test run=4

# Run a few specific test cases (4, 8, and 12 in this case):
make test run='4 8 12'
