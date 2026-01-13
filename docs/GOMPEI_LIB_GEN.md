# GompeiLib Token Generation

To run GompeiLib, generate a GitHub **Personal Access Token (Classic)**.

## Generating Access Token (GitHub)

* Go into your GitHub Account Settings
* Scroll down, Open **Developer Tokens**
* Go to Personal access tokens > Tokens (classic).
* Click Generate new token > Generate new token (classic).
* Name the token IE: GompeiLib
* Select 'read:packages' under 'write:packages'

![Token Gen Selection](images/Access%20Token%20Settings.png)
* **Click Generate token(scroll down) and COPY THIS TOKEN AND STORE IT IN A SAFE LOCATION! You will NOT be able to see it again.**

## Create gradle.properties file

* Open / Create '.gradle/gradle.properties' file in your home directory
  * **Linux/Unix**: ~/.gradle/gradle.properties.txt
  * **Windows**: C:\Users\insert_username\\.gradle\gradle.properties.txt
  * Create 'gradle.properties' file as a .txt if you don't have one already
* Add the following lines, replacing the placeholders with your GitHub username and the generated token
```
gpr.user=<GIT_USERNAME>
gpr.key=<GENERATED_TOKEN>
```

## Test Generated Token

* Build robot code with GompeiLib to see if your generated token works
