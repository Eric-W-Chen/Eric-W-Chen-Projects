#include "debug.h"
#include "procfs.h"

#include <fcntl.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <unistd.h>
#include <stdlib.h>
#include <string.h>
#include <limits.h>
#include <stdio.h>
#include <dirent.h>
#include <stdbool.h>
#include <errno.h>
#include <math.h>
#include <ctype.h>


/**
 * Reads the next line and puts in the null terminator at the end.
 *
 * Parameters:
 * - fd = file descriptor.
 * - buf = line that we're reading
 * - sz = size of the buffer
 *   
 * Returns: size of the buffer 
 **/

ssize_t line_read(int fd, char *buf, size_t sz)
{
	int count = 0;		// counts bytes (1 char = 1 byte)
	char byte_character = 0; //the character we're at

	while (byte_character != '\n') {
		int read_output = read(fd, &byte_character, 1);		//going one character at a time and checks to see if the value returned is valid

		if (read_output <= 0) {
			return read_output; //error
		}

		*(buf + count) = byte_character;	//copies byte_character into buffer
		count++;

		if (count >= sz) {	//if count is bigger than the size
			return count;	//reached our limit
		}
	}

	buf[count-1] = '\0';
	return count;	//return size
}


/**
 * Retrieves the next token from a string.
 *
 * Parameters:
 * - str_ptr: maintains context in the string, i.e., where the next token in the
 *   string will be. If the function returns token N, then str_ptr will be
 *   updated to point to token N+1. To initialize, declare a char * that points
 *   to the string being tokenized. The pointer will be updated after each
 *   successive call to next_token.
 *
 * - delim: the set of characters to use as delimiters
 *
 * Returns: char pointer to the next token in the string.
 */

char *next_token(char **str_ptr, const char *delim)
{
	if (*str_ptr == NULL) {
		return NULL;
	}

	size_t tok_start = strspn(*str_ptr, delim);
	size_t tok_end = strcspn(*str_ptr + tok_start, delim);

	/* Zero length token. We must be finished. */
	if (tok_end  == 0) {
		*str_ptr = NULL;
		return NULL;
	}
	/* Take note of the start of the current token. We'll return it later. */
	char *current_ptr = *str_ptr + tok_start;
	/* Shift pointer forward (to the end of the current token) */
	*str_ptr += tok_start + tok_end;

	if (**str_ptr == '\0') {
		/* If the end of the current token is also the end of the string, we
		 * must be at the last token. */
		*str_ptr = NULL;
	} 
	else {
		/* Replace the matching delimiter with a NUL character to terminate the
		 * token string. */
		**str_ptr = '\0';
		/* Shift forward one character over the newly-placed NUL so that
		 * next_pointer now points at the first character of the next token. */
		(*str_ptr)++;
	}

	return current_ptr;
}

/**
 * Retrieves the host name from /proc/sys/kernel/hostname 
 *
 * Parameters:
 * - proc_dir: the proc directory
 * - hostname_buf: line that we're reading
 * - buf_sz: the size of the buffer
 * 
 *
 * Returns: 0 if successful -1 if unsuccessful
 */

int pfs_hostname(char *proc_dir, char *hostname_buf, size_t buf_sz)
{
	// proc_dir/kernel/hostname
	size_t proc_dir_len = strlen(proc_dir);
	char end_of_hostname_path[HOST_NAME_MAX+1] = { 0 };
	char* hostname_path = (char*) malloc(proc_dir_len+HOST_NAME_MAX+1);
	strcpy(end_of_hostname_path, "/sys/kernel/hostname\0");
	strcpy(hostname_path, proc_dir);      // /proc/kernel/hostname. copies /proc
	strcat(hostname_path, end_of_hostname_path);  //copying the rest of the string into (/kernel/hostname)
	int hostname_fd = open(hostname_path, O_RDONLY);
	if (hostname_fd == -1) {        //file doesn't open
		close(hostname_fd);
		free(hostname_path);
		return -1;
	}

	size_t bytes_read = line_read(hostname_fd, hostname_buf, buf_sz);
	close(hostname_fd);

	if (bytes_read == 0)    //file not found
	{
		return -1;
	}

	free(hostname_path);
	return 0;  
}

/**
 * Retrieves the host name from /proc/sys/kernel/osrelease
 * 
 * Parameters:
 * - proc_dir: the proc directory
 * - version_buf: the line that we're reading
 * - buf_sz: the size of the buffer
 * 
 *
 * Returns: 0 if successful -1 if unsuccessful
 */

int pfs_kernel_version(char *proc_dir, char *version_buf, size_t buf_sz)
{
	size_t proc_dir_len = strlen(proc_dir);
	char end_of_version_path[22];		//char array size of the directory path
	char* version_path = (char*) malloc(proc_dir_len + 22);
	strcpy(end_of_version_path, "/sys/kernel/osrelease\0");
	strcpy(version_path, proc_dir);      // /proc/kernel/osrelease. copies /proc
	strcat(version_path, end_of_version_path);  //copying the rest of the string into (/kernel/hostname)

	int version_fd = open(version_path, O_RDONLY);
	if (version_fd == -1) {       //file doesn't open	
		close(version_fd);
		free(version_path);
		return -1;
	}

	char* version = version_buf;
	line_read(version_fd, version, buf_sz);
	strsep(&version_buf, "-");
	close(version_fd);
	free(version_path);
	return 0;
}

/**
 * Retrieves the cpu model from /proc/cpuinfo
 * 
 * Parameters:
 * - proc_dir: the proc directory
 * - model_buf: the line that we're reading
 * - buf_sz: the size of the buffer
 * 
 *
 * Returns: 0 if successful -1 if unsuccessful
 */

int pfs_cpu_model(char *proc_dir, char *model_buf, size_t buf_sz)
{
	size_t proc_dir_len = strlen(proc_dir);
	char end_of_model_path[9] = { 0 };
	char* model_path = (char*) malloc(proc_dir_len + 9); 
	strcpy(end_of_model_path, "/cpuinfo\0");
	strcpy(model_path, proc_dir);    
	strcat(model_path, end_of_model_path);    
	int model_fd = open(model_path, O_RDONLY);

	if (model_fd == -1) {
		close(model_fd);
		free(model_path);
		return -1;
	}

	char tokenizer [128] = { 0 };
	char *processor;
	int bytes_read = line_read(model_fd, tokenizer, buf_sz);

	while (bytes_read > 0) {
		if (strstr(tokenizer, "model name")){
			processor = (tokenizer + strcspn(tokenizer, ":") + 2);
			strcpy(model_buf, processor);
			free(model_path);
			close(model_fd);
			return 0;
		}

		bytes_read = line_read(model_fd, tokenizer, buf_sz);	//next line
	}

	close(model_fd);
	free(model_path);
	return 0;
}

/**
 * Retrieves the cpu units from /proc/cpuinfo
 * 
 * Parameters:
 * - proc_dir: the proc directory
 *
 * Returns: # of cpu units found
 */

int pfs_cpu_units(char *proc_dir)
{
	size_t proc_dir_len = strlen(proc_dir);
	char end_of_cores_path[9] = { 0 };
	char* cores_path = (char*) malloc(proc_dir_len + 9); 
	strcpy(end_of_cores_path, "/cpuinfo\0");
	strcpy(cores_path, proc_dir);     // /proc/kernel/hostname. copies /proc
	strcat(cores_path, end_of_cores_path);    //copying the rest of the string in (/kernel/hostname)
	int cores_fd = open(cores_path, O_RDONLY);

	if (cores_fd == -1) {
		close(cores_fd);
		free(cores_path);
		return 0;	//file can't open so no processing units can be found
	}

	char word_finder [128] = { 0 };
	int counter = 0;
	int bytes_read = line_read(cores_fd, word_finder, 127);

	while (bytes_read > 0) {
		if (strstr(word_finder, "processor\0")){
			counter++;
		}
		bytes_read = line_read(cores_fd, word_finder, 127);	//next line
	}

	close(cores_fd);
	free(cores_path);
	return counter;
}

/**
 * Retrieves the uptime from /proc/uptime
 * 
 * Parameters:
 * - proc_dir: the proc directory
 *
 * Returns: The uptime in seconds
 */

double pfs_uptime(char *proc_dir)
{
	size_t proc_dir_len = strlen(proc_dir);
	char end_of_uptime_path[8];
	char* uptime_path = (char*) malloc(proc_dir_len + 8); 
	strcpy(end_of_uptime_path, "/uptime\0");
	strcpy(uptime_path, proc_dir);        // /proc/kernel/hostname. copies /proc
	strcat(uptime_path, end_of_uptime_path);  //copying the rest of the string in (/kernel/hostname)
	int uptime_fd = open(uptime_path, O_RDONLY);

	if (uptime_fd == -1) {
		close(uptime_fd);
		free(uptime_path);
		return -1.0;
	}

	char uptime_line [1024] = { 0 };
	char * string = strdup(uptime_line);
	int bytes_read = line_read(uptime_fd, uptime_line, 1023);

	if (bytes_read > 0) {
		if (strsep(&string, " ")) { 
			double ret_value = atof(uptime_line);
			close(uptime_fd);
			free(uptime_path);
			free(string);
			return ret_value;
		}
	}

	return 0.0; 
}

/**
 * Converts uptime from seconds to years, days, hours, and minutes
 *  
 * Parameters:
 * - time: seconds to be converted
 * - uptime_buf: string to print out formatted time
 * 
 * Returns: 0 if successful
 */

int pfs_format_uptime(double time, char *uptime_buf)
{
	long years = 0;
	long days = 0;
	long hours = 0;
	long minutes = 0;
	long seconds = 0;
	const long seconds_in_year = 31536000;
	const long seconds_in_day = 86400;
	const long seconds_in_hour = 3600;
	const long seconds_in_minute = 60;

	while(time >= seconds_in_year) {
		years++;
		time -= seconds_in_year;
	}
	while(time >= seconds_in_day) {
		days++;
		time -= seconds_in_day;
	}
	while (time >= seconds_in_hour) {
		hours++;
		time-= seconds_in_hour;
	}
	while(time >= seconds_in_minute) {
		minutes++;
		time -= seconds_in_minute;
	}  

	seconds = time;

	int time_format = 0;

	if (years > 0) {
		time_format += sprintf(uptime_buf + time_format, "%ld years, ", years);		//prevents overwriting
	}
	if (days > 0) {
		time_format += sprintf(uptime_buf + time_format, "%ld days, ", days);
	}
	if (hours > 0) {
		time_format += sprintf(uptime_buf + time_format, "%ld hours, ", hours);
	}

	time_format += sprintf(uptime_buf + time_format,  "%ld minutes, ", minutes);
	time_format += sprintf(uptime_buf + time_format, "%ld seconds", seconds);
	time_format = 0; //let's get rid of that static analysis problem
	return time_format;   
}

/**
 * Finds load average in /proc/loadavg
 *  
 * Parameters:
 * - proc_dir: the proc directory
 * 
 * Returns: -1 if unsuccessful, otherwise returns the load average
 */

struct load_avg pfs_load_avg(char *proc_dir)
{
	struct load_avg lavg = { 0 };
	size_t proc_dir_len = strlen(proc_dir);
	char end_of_load_path[9] = { 0 };
	char* load_path = (char*) malloc(proc_dir_len + 9); 
	strcpy(end_of_load_path, "/loadavg\0");
	strcpy(load_path, proc_dir);      // /proc/kernel/hostname. copies /proc
	strcat(load_path, end_of_load_path);  //copying the rest of the string in (/kernel/hostname)
	int load_fd = open(load_path, O_RDONLY);

	if (load_fd == -1) {
		free(load_path);
		close(load_fd);
		return lavg;
	}

	char loadavg_line [128] = { 0 };   
	int bytes_read = line_read(load_fd, loadavg_line, 127);

	if (bytes_read > 0) {
		char* string = strdup(loadavg_line);
		char* original_string = string;
		char* space = strsep(&string, " ");
		lavg.one = atof(space);
		space = strsep(&string," ");
		lavg.five = atof(space);
		space = strsep(&string," ");
		lavg.fifteen = atof(space);
		free(original_string);
	}   

	return lavg;
}

/**
 * Finds cpu usage in /proc/stat
 *  
 * Parameters:
 * - procfs_dir: the proc directory
 * - prev: the previous total and idle in cpu_stats struct
 * - curr: the current total and idle in cpu_stats struct
 * 
 * Returns: -1.0 if unsuccessful, otherwise returns the value of current idle - previous idle / current total - previous total
 */

double pfs_cpu_usage(char *procfs_dir, struct cpu_stats *prev, struct cpu_stats *curr)
{
	size_t proc_dir_len = strlen(procfs_dir);
	char end_of_usage_path[6];
	strcpy(end_of_usage_path, "/stat\0");
	char* usage_path = (char*) malloc(proc_dir_len + 6); 
	strcpy(usage_path, procfs_dir);        // /proc/kernel/hostname. copies /proc
	strcat(usage_path, end_of_usage_path);  //copying the rest of the string in 
	int usage_fd = open(usage_path, O_RDONLY);

	if (usage_fd == -1) {
		free(usage_path);
		close(usage_fd);
		return -1.0;
	}

	char cpu_usage [128] = { 0 };   
	int line_reader = line_read(usage_fd, cpu_usage, 127);
	char * string = cpu_usage;
	int count = 0;
	double it1 = 0.0;
	double it2 = 0.0;
	double ct1 = 0.0;
	double ct2 = 0.0;
	curr->idle = 0;
	curr->total = 0;

	while (line_reader > 0)
	{
		char * space = strsep(&string, " "); // Get "cpu"
		if (space == NULL) {
			break;
		}
		if (count == 5) {
			curr->idle = atol(space);     //bc idle is 4
			curr->total += atol(space);
		}
		else if (count > 1) {			//else if to prevent double adding
			curr->total += atol(space);
		}
		count++;
	}   

	free(usage_path);
	close(usage_fd);

	it1 = (double) curr -> idle;
	it2 = (double) prev -> idle;
	ct1 = (double) curr -> total;
	ct2 = (double) prev -> total;
	double value = ((double) (it1 - it2) / (double) (ct1 - ct2));
	double ret_value = ((double) (1.0 - value));

	if (isnan(value) != 0 || (it1 - it2) < 0 || (ct1 - ct2) < 0) {
		return 0.0;
	}

	return ret_value;
}

/**
 * Finds memory usage in /proc/meminfo
 *  
 * Parameters:
 * - procfs_dir: the proc directory
 * 
 * Returns: struct containing MemTotal and MemAvailable
 */

struct mem_stats pfs_mem_usage(char *procfs_dir)
{
	struct mem_stats mstats = { 0 };
	// proc_dir/kernel/hostname
	size_t proc_dir_len = strlen(procfs_dir);
	char end_of_model_path[9];
	strcpy(end_of_model_path, "/meminfo\0");
	char* mem_path = (char*) malloc(proc_dir_len + 9); 
	strcpy(mem_path, procfs_dir);       // /proc/kernel/hostname. copies /proc
	strcat(mem_path, end_of_model_path);  //copying the rest of the string in (/kernel/hostname)
	int mem_fd = open(mem_path, O_RDONLY);

	if (mem_fd == -1) {
		close(mem_fd);
		free(mem_path);
		return mstats;
	}

	char tokenizer [128] = { 0 };
	double tot = 0.0;
	double avail = 0.0;

	while (line_read(mem_fd, tokenizer, 127) > 0) { 
		char *token_ptr = tokenizer;
		if (strstr(tokenizer, "MemTotal")) {
			next_token(&token_ptr,  ": ");
			tot = (atof(next_token(&token_ptr, ": "))/1048576.00);
		}
		if (strstr(tokenizer, "MemAvailable")) {
			next_token(&token_ptr, ": ");
			avail = (atof(next_token(&token_ptr, ": "))/1048576.00);
		}
	}

	mstats.total = tot;
	mstats.used = tot-avail;
	close(mem_fd);
	free(mem_path);
	return mstats;
}

/**
 * Checks if all the characters in a string is a digit
 *   
 * Parameters:
 * - str: the string to check
 * 
 * Returns: -1 if it's all digits otherwise return 0
 */

int isAllDigits(char* str)
{
	for (int i = 0; i < strlen(str - 1); i++) {
		if (isdigit(str[i]) != 0) {
			return -1;
		}
	}

	return 0;
}

/**
 * Use opendir and readdir to list all numerical processes in /proc. Count up each process in each state and accumulate the states
 * into the task_stats struct. 
 * 
 * Returns: task_stats struct containing processes and their states
 */
struct task_stats *pfs_create_tstats()
{
	struct task_stats * tasks = (struct task_stats*) calloc(1, sizeof(struct task_stats)); //allocate space for array for active tasks and task info 
	tasks->active_tasks = (struct task_info*) malloc(sizeof(struct task_info)); //create space for active tasks in task_stats
	return tasks;
}

/**
 * Frees the memory spaces allocated for the processes.
 * Parameters:
 * - tstats: struct containing processes
 * Returns: void
 */
void pfs_destroy_tstats(struct task_stats *tstats)
{
	//if struct contains any pointers, free them and free any memory allocations
	free(tstats->active_tasks);
	free(tstats);
}

/**
 * Use opendir and readdir to list all processes in /proc. Also go to /proc/pid/stat to find information about the state of each process. Count up each process in each state and accumulate the states
 * into the task_stats struct. 
 *
 * Parameters:
 * - proc_dir: the proc containing all the numerical
 * - tstats: the struct containing processes and information about the states of each process
 * 
 * Returns: 0 if successful or if the path is null, -1 if unsuccessful
 */
int pfs_tasks(char *proc_dir, struct task_stats *tstats)
{
	DIR *proc_path;

	struct dirent *entry;    //represents some file in a directory stream
	proc_path = opendir(proc_dir);

	if (proc_path == NULL) {
		return 0;
	}

	int iterator = 0;
	tstats->total = 0;
	tstats->running = 0;
	tstats->sleeping = 0;
	tstats->stopped = 0;
	tstats->zombie = 0;
	tstats->waiting = 0;

	// Get every file in proc_path
	while ((entry=readdir(proc_path)) != NULL) {
		if (entry->d_type == DT_DIR && isAllDigits(entry->d_name)) {    //checking if files in directory are alphabetical letters
			tstats->active_tasks = realloc(tstats->active_tasks, (iterator+1) * sizeof(struct task_info));	//if there's sleeping, save the memory location otherwise increment iterator memory space. current location in the active tasks, passes by sleeping processes
			tstats->active_tasks[iterator].pid = atoi(entry->d_name);
			char *pid_path = malloc(sizeof(char) * (1 + strlen(proc_dir) + strlen("/") + strlen(entry->d_name) + strlen("/status")));
			strcpy(pid_path, proc_dir);       // copies /proc
			strcat(pid_path, "/");		//adds the /
			strcat(pid_path, entry->d_name);  //the pid. (*entry).d_name	
			strcat(pid_path, "/status");	//build /proc/[pid]/status\0
			int stat_fd = open(pid_path, O_RDONLY);

			if (stat_fd == -1) {
				return -1;
			}

			char stat_line[128] = { 0 };

			while (true) {
				int line_reader = line_read(stat_fd, stat_line, 127);

				if (line_reader <= 0) {
					break;
				}


			//	char *cpu_path = malloc(sizeof(char) * (1 + strlen(proc_dir) + strlen("/") + strlen(entry->d_name) + strlen("/stat")));
			//	strcpy(cpu_path, proc_dir);
			//	strcat(cpu_path, "/");
			//	strcat(cpu_path, entry->d_name);
			//	strcat(cpu_path, "/stat");
			//	int cpu_fd = open(cpu_path, O_RDONLY);
			//	//make a buffer, line read and copy the line_read into the buffer)

			//	char cpu_buf [128] = { 0 };
			//	int cpu_counter = 0;
			//	double utime;
			//	double stime;
			//	double cutime;
			//	double cstime;
			//	double starttime;
			//	double total_time;

			//	line_read(cpu_fd, cpu_buf, 127);

			//	char *ptr = cpu_buf;

			//	while(true){
			//		cpu_counter++;

			//		char *cpu_buf_ptr = strsep(&ptr, " ");

			//		if (cpu_buf_ptr == NULL) {
			//			break;
			//		}

			//		if (cpu_counter == 12){
			//			utime = atof(cpu_buf_ptr);
			//		}
			//		if (cpu_counter == 13){
			//			stime = atof(cpu_buf_ptr);
			//		}
			//		if (cpu_counter == 14){
			//			cutime = atof(cpu_buf_ptr);
			//		}
			//		if (cpu_counter == 15){
			//			cstime = atof(cpu_buf_ptr);
			//		}
			//		if (cpu_counter == 20){
			//			starttime = atof(cpu_buf_ptr);
			//		}

			//		total_time = utime + stime + cutime + cstime;

			//		double seconds = utime - (starttime /(float) sysconf(_SC_CLK_TCK));

			//		double cpu_usage = 100.0 * ((total_time /(float) sysconf(_SC_CLK_TCK) / seconds));
			//		tstats->active_tasks[iterator].cpu_info = cpu_usage;
			//	}
				// Read the pid/exec_name/state from the /proc/[pid]/stat file
				if (strstr(stat_line, "Name:") != NULL) {
					char string[26];
					strcpy(string, &stat_line[strcspn(stat_line, ":") + 2]);
					strcpy(tstats->active_tasks[iterator].name, string);
					tstats->active_tasks[iterator].name[25] = '\0';
				}

				else if (strstr(stat_line, "State:") != NULL) {
					char string[13];
					int i = strcspn(stat_line, ":");
					strcpy(string, &stat_line[i + 2]);	

					if (strstr(string, "running")) {
						strcpy(tstats->active_tasks[iterator].state, "running");
						tstats->running++; //(*tasks).running
						iterator++;
					}
					else if (strstr(string, "disk sleep")) {
						strcpy(tstats->active_tasks[iterator].state, "disk sleep");
						tstats->waiting++;
						iterator++;
					}
					else if (strstr(string, "sleeping") || (strstr(string, "idle"))) {
						tstats->sleeping++;
					}
					else if (strstr(string, "stopped")) {
						strcpy(tstats->active_tasks[iterator].state, "stopped");
						tstats->stopped++;
						iterator++;
					}

					else if (strstr(string, "tracing stop")) {	
						strcpy(tstats->active_tasks[iterator].state, "tracing stop");
						tstats->stopped++;
						iterator++;
					}
					else if (strstr(string, "zombie")) {
						strcpy(tstats->active_tasks[iterator].state, "zombie");
						tstats->zombie++;
						iterator++;
					}
				}

				else if(strstr(stat_line, "Uid:")) {
					char uid[32];
					char *ptr = stat_line;
					strsep(&ptr, "\t");

					for (int i = 0; i < strlen(ptr)-1; i++) {
						if (isdigit(ptr[i]) != 0) {
							uid[i+1] = '\0';
							break;
						}
						uid[i] = ptr[i];
					}

					tstats->active_tasks[iterator].uid = atoi(uid);
				}
			}

			tstats->total++;
			close(stat_fd);
			free(pid_path);
		}
	}

	closedir(proc_path);
	return 0;	
}
