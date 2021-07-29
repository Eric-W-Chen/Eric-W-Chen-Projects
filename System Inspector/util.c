#include "debug.h"
#include "procfs.h"

#include <fcntl.h>
#include <sys/types.h>
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

ssize_t read_line(int fd, char *buf, size_t sz)
{
	int count = 0;		// counts bytes (1 char = 1 byte)
	char byte_character = 0; //the character we're at

	while (byte_character != '\n') {
		int read_output = read(fd, &byte_character, 1);		//going one character at a time. read output checks to see if the value returned is valid

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

/* Creates user-friendly bar to demonstrate cpu usage and memory usage
 * 
 * Parameters:
 * - buf: character array to display bar
 * - frac:  number to demonstrate how far the bar should be filled and the cpu and memory usage
*/
void draw_percbar(char *buf, double frac)
{
    double percentage = frac * 100;

    if (percentage > 100.0){	//if > 100 make it = 100
	    percentage = 100.0;
    }

    if (isnan(percentage) || percentage <= 0.0) {	//if negative or < 0 make it = 0
	    percentage = 0.0;
    } 

    double frac_num = frac;
    buf[0] = '[';
    buf[21] = ']';
    buf[22] = ' ';

    for (int i = 1; i < 21; i++) {
	    if (frac_num >= 0.0445) {	//set up # for every 5%
		    buf[i] = '#';
		    frac_num -= 0.050000;
	    }
	    else {
		    buf[i] = '-';	//else make it -
	    }
    }
    sprintf(&buf[23], "%.1f", percentage);	//only 2 decimal places
    strcat(buf, "%");	//% sign
}

/* Converts UID to username
 *
 * Parameters:
 * - name_buf: character array for username
 * - uid: the uid to be converted
*/
void uid_to_uname(char *name_buf, uid_t uid)
{
    int uid_fd = open("/etc/passwd", O_RDONLY);

    if (uid_fd == -1) {
	    return;
    }

    char temp_name_buf[26];
    char buf[100] = { 0 };

    sprintf(name_buf, "%d", uid);	//adding uid to name_buf

    while ((read_line(uid_fd, buf, 99) > 0)) {
	int id;
	char *string;
	char *ptr = buf;
	
	string = strsep(&ptr, ":");
	strcpy(temp_name_buf, string);
	string = strsep(&ptr, ":");
	id = atol(ptr);		//converts id into a long

	if(uid == id) {
		strcpy(name_buf, temp_name_buf);
		name_buf[15] = '\0';
	}
    }
    close(uid_fd);
} 
