import fetch from 'node-fetch';
import { GithubPersonnalToken, GithubRepo, GithubUser } from './variables';

/**
 * The following functions use the Github REST Issues API
 * to link the Bug Tracker with Github Issues
 * To learn more see the official documentation:
 * https://docs.github.com/en/rest/issues/issues
 */

let id: number;

// This function creates an issue in Github Issues 
// whenever a bug is added on the Bug Tracker
const createGitIssues = async (title: string, body: string) => {
    const JSON_DATA = {
        title: `${title}`,
        body: `${body}`,
        labels: [
            "bug"
        ]
    };

    await fetch(`https://api.github.com/repos/${GithubUser}/${GithubRepo}/issues`, {
        method: 'post',
        body:    JSON.stringify(JSON_DATA),
        headers: {'Content-Type': 'application/json', 'Authorization': `token ${GithubPersonnalToken}`}
    })
        .then(res => res.json())
        .then(res =>
            id = res.number
        )

   return id;
         
    
        


}

// This function updates an issue in Github Issues 
// whenever a bug is updated on the Bug Tracker
const updateGitIssues = (title: string, body: string, ISSUE_NUMBER: number) => {
    const JSON_DATA = {
        title: `${title}`,
        body: `${body}`,
        labels: [
            "bug"
        ]
    };


    fetch(`https://api.github.com/repos/${GithubUser}/${GithubRepo}/issues/${ISSUE_NUMBER}`, {
        method: 'patch',
        body:    JSON.stringify(JSON_DATA),
        headers: {'Content-Type': 'application/json', 'Authorization': `token ${GithubPersonnalToken}`}
    })
        .then(res =>  res.json())
}

// This function closes an issue in Github Issues 
// whenever a bug is closed on the Bug Tracker
const closeGitIssues = (ISSUE_NUMBER: number) => {
    const JSON_DATA = {
        lock_reason: 'resolved'
    };

    fetch(`https://api.github.com/repos/${GithubUser}/${GithubRepo}/issues/${ISSUE_NUMBER}/lock`, {
        method:  'PUT',
        body:    JSON.stringify(JSON_DATA),
        headers: {'Content-Type': 'application/json', 'Authorization': `token ${GithubPersonnalToken}`}
    })
        .then(res =>  res.json())
        .then(res => console.log(res))
}

// This function re-opens an issue in Github Issues 
// whenever a bug is re-opened on the Bug Tracker
const reopenGitIssues = (ISSUE_NUMBER: number) => {
    fetch(`https://api.github.com/repos/${GithubUser}/${GithubRepo}/issues/${ISSUE_NUMBER}/lock`, {
        method: 'delete',
        headers: {'Content-Type': 'application/json', 'Authorization': `token ${GithubPersonnalToken}`}
    })
        .then(res =>  res.json())
        .then(res => console.log(res))
}

export { createGitIssues };
export { updateGitIssues };
export { closeGitIssues };
export { reopenGitIssues };