package com.authentication.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;

import com.authentication.entity.Authentication;
import com.authentication.entity.User;
import com.authentication.repository.AuthenticationRepository;
import com.authentication.repository.UserRepository;

/* 
 * Controller for development testing tools
 * TODO: NOT FOR FINAL RELEASE!
 * This controller can be used to add new users, managers, and administrators
 * to the server instead of manually adding entries using SQL
 */

@Controller
public class DevtoolsController {

	@Autowired
	UserRepository userRepo;
	
	@Autowired
	AuthenticationRepository authRepo;
	
	@RequestMapping("/devtools/createaccount")
	public String createAccount(Model model) {
		model.addAttribute("user", new User());
		return "devtools/account/accountForm";
	}
	
	/*Create a user account with a specific role*/
	@RequestMapping("/devtools/api/createaccount")
	public String saveUser(@ModelAttribute User user, Model model) {
		
		model.addAttribute("user", user);
		try {
			String password = new BCryptPasswordEncoder().encode(user.getPassword());
			user.setPassword(password);
			userRepo.save(user);
			
			Authentication authUser = new Authentication();
			authUser.setUser(user);
			authUser.setUsername(user.getUsername());
			authUser.setPassword(password);
			authUser.setRole(user.getRole());
			
			authRepo.save(authUser);
			model.addAttribute("authentication", authUser);
			
		} catch (Exception e) {
			model.addAttribute("errorString", e.toString());
			return "devtools/account/accountFailure";
		}
		return "devtools/account/accountSuccess";
	}
	
}
