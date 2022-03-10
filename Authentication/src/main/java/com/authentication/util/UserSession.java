package com.authentication.util;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

import com.authentication.entity.User;
import com.authentication.repository.UserRepository;


public class UserSession {
	
	@Autowired
	private static UserRepository userRepo;
	
	public static Optional<User> getCurrentUser() {
		return userRepo.findByUsername(getCurrentUsername());
	}
	
	public static String getCurrentUsername() {
		Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();

		String username;
		if (principal instanceof UserDetails) {
			username = ((UserDetails)principal).getUsername();
		} else {
			username = principal.toString();
		}
		return username;
	}
}
