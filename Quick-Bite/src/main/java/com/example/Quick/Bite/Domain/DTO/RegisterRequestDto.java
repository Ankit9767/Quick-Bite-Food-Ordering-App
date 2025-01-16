package com.example.Quick.Bite.Domain.DTO;

import com.example.Quick.Bite.Enumerations.UserRole;

import lombok.Data;

@Data
public class RegisterRequestDto {
    private String firstName;
    private String lastName;
    private String email;
    private String phoneNumber;
    private UserRole role ;
    private String userName;
    private Boolean isActive;
    private String password;
    
	public RegisterRequestDto(String firstName, String lastName, String email, String phoneNumber, UserRole role,
				String userName, Boolean isActive, String password)
	{
		
		this.firstName = firstName;
		this.lastName = lastName;
		this.email = email;
		this.phoneNumber = phoneNumber;
		this.role = role;
		this.userName = userName;
		this.isActive = isActive;
		this.password = password;
	}
	
	public RegisterRequestDto() {
		super();
	}
	
	public String getFirstName() {
		return firstName;
	}
	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}
	public String getLastName() {
		return lastName;
	}
	public void setLastName(String lastName) {
		this.lastName = lastName;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public String getPhoneNumber() {
		return phoneNumber;
	}
	public void setPhoneNumber(String phoneNumber) {
		this.phoneNumber = phoneNumber;
	}
	public UserRole getRole() {
		return role;
	}
	public void setRole(UserRole role) {
		this.role = role;
	}
	public String getUserName() {
		return userName;
	}
	public void setUserName(String userName) {
		this.userName = userName;
	}
	public Boolean getIsActive() {
		return isActive;
	}
	public void setIsActive(Boolean isActive) {
		this.isActive = isActive;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
    
}

