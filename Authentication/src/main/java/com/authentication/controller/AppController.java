package com.authentication.controller;

import java.util.List;
import java.util.Optional;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.authentication.entity.Authentication;
import com.authentication.entity.User;
import com.authentication.repository.AuthenticationRepository;
import com.authentication.repository.UserRepository;
import com.authentication.util.Role;
import com.authentication.util.UserSession;

@Controller
public class AppController {
	
	@Autowired
	UserRepository userRepo;
	
	@Autowired
	AuthenticationRepository authRepo;
	
	@GetMapping("/")
	public String home() {
		return "login";
	}

    @GetMapping("/help")
    public String viewHelp() {
        return "help";
    }
    
    @GetMapping("/logout")
    public String handleLogout(HttpServletRequest request, HttpServletResponse response) {
        org.springframework.security.core.Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null){    
            new SecurityContextLogoutHandler().logout(request, response, auth);
        }
        return "redirect:/";
    }
    
    /*Find the roles of the user and show redirect them to their pages*/
    @GetMapping("/accessroles")
    public String rolePages() {
    	
    	
    	try {
	    	User currUser = userRepo.findByUsername(UserSession.getCurrentUsername()).get();
	    	Role role = currUser.getRole();
	    	
	    	if(role.equals(Role.ADMINISTRATOR)) {
	    		return "redirect:/admin";
	    	} else if(role.equals(Role.MANAGER)) {
	    		return "redirect:/manager";
	    	} else if(role.equals(Role.USER)) {
	    		return "redirect:/user";
	    	} else {
	    		return "redirect:/guest";
	    	}
	    	
    	} catch (Exception e) {
    		//view = new ModelAndView("redirect:/homepage");
    	}
    	return "redirect:/";
    	
    }
    
    @RequestMapping("/admin")
    public String showAdminPage(Model model) {
    	
    	if(!validateRole(Role.ADMINISTRATOR)) {
    		return "redirect:/";
    	} else {
			model.addAttribute("user", new User());
			List<User> users = userRepo.findAll();
			model.addAttribute("users", users);
			model.addAttribute("username", getCurrentUsername());
    	}
    	return "rolepages/adminpage";
    }
    
    @GetMapping("/manager")
    public String showManagerPage(Model model) {
    	if(!validateRole(Role.MANAGER)) {
    		return "redirect:/";
    	} else {
    		model.addAttribute("user", new User());
    		List<User> users = userRepo.findAll();
			model.addAttribute("users", users);
			model.addAttribute("username", getCurrentUsername());
    	}
    	return "rolepages/managerpage";
    }
    @GetMapping("/user")
    public String showUserPage(Model model) {
    	if(!validateRole(Role.USER)) {
    		return "redirect:/";
    	} else {
    		List<User> users = userRepo.findAll();
			model.addAttribute("users", users);
			model.addAttribute("username", getCurrentUsername());
    	}
    	return "rolepages/userpage";
    }
    
    @GetMapping("/guest")
    public String showGuestPage(Model model) {
    	
    	List<User> users = userRepo.findAll();
		model.addAttribute("users", users);
    	return "rolepages/guestpage";
    }
    
    @RequestMapping("/addUser")
	public String saveUser(@ModelAttribute User user, Model model) {
		
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
		
		if(validateRole(Role.ADMINISTRATOR)) {
			return "redirect:/admin";
		} else if(validateRole(Role.MANAGER)) {
			return "redirect:/manager";
		} else {
			return "redirect:/";
		}
	}
    
    @RequestMapping("/delete")
    public String deleteUser(@RequestParam(name="id") int id) {
    	
    	userRepo.deleteById(id);
    	return "redirect:/admin";
    }
    

    @RequestMapping("/edit")
    public String displayUser(@RequestParam(name="id") int id, Model model) {
    	User user = userRepo.getById(id);
    	model.addAttribute("user", user);
    	String loggedInUserRole = userRepo.findByUsername(UserSession.getCurrentUsername()).get().getRoleName();
    	model.addAttribute("loggedInUserRole", loggedInUserRole);
    	return "editform";
    }
    
    @RequestMapping("/user/update")
    public String update(@RequestParam(name="id") int id, @ModelAttribute User user, Model model) {
    	
    	
    	User u = userRepo.getById(id);
    	u.setfName(user.getfName());
    	u.setlName(user.getlName());
    	u.setUsername(user.getUsername());
    	u.setEmail(user.getEmail());
    	u.setRole(user.getRole());
    	userRepo.save(u);
    	model.addAttribute("updatedUser", u);
    	
    	//handle errors in case of exception
    	
    	return "redirect:/accessroles";
    	
    }
    
    /*TODO: Add mapping for /error to handle errors */
    
    
    /*Using the user that is currently logged in to validate a role*/
    private boolean validateRole(Role role) {
    	
    	User currUser = userRepo.findByUsername(UserSession.getCurrentUsername()).get();
    	return role.equals(currUser.getRole());
    	
    }
    
    private String getCurrentUsername() {
    	User currUser = userRepo.findByUsername(UserSession.getCurrentUsername()).get();
    	return currUser.getUsername();
    }
    
    
    
    
    


}
