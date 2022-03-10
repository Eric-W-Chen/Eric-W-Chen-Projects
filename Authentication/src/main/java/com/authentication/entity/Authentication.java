package com.authentication.entity;

import javax.persistence.*;

import com.authentication.util.Role;

@Entity
@Table(name="authentication")
public class Authentication {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private int id;
    
    @OneToOne
    @JoinColumn(name="userId", nullable=false)
    private User user;

    @Column(nullable=false, unique=true)
    private String username;
    
    @Column(nullable=false, length = 64)    //encrypted length password
    private String password;
   
    @Column(nullable=false)
    private Role role;
    
	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public Role getRole() {
		return role;
	}

	public void setRole(Role role) {
		this.role = role;
	}

	@Override
	public String toString() {
		return "Authentication [id=" + id + ", user=" + user + ", username=" + username + ", password=" + password
				+ ", role=" + role + "]";
	}

    
	

    
    
}
