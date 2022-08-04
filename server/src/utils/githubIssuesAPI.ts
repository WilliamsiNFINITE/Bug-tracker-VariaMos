import fetch from 'node-fetch';
import { GithubPersonnalToken, GithubRepo, GithubUser } from './variables';

/**
 * The following functions use the Github REST Issues API
 * to link the Bug Tracker with Github Issues
 * To learn more see the official documentation:
 * https://docs.github.com/en/rest/issues/issues
 */

let id: number;

/**
 *  This function creates an issue in Github Issues 
 */
const createGitIssues = async (title: string, body: string) => {
    const JSON_DATA = {
        title: `${title}`,
        body: `${body}`,
        labels: [
            "bug"
        ]
    };
    try {
        await fetch(`https://api.github.com/repos/${GithubUser}/${GithubRepo}/issues`, {
            method: 'post',
            body:    JSON.stringify(JSON_DATA),
            headers: {'Content-Type': 'application/json', 'Authorization': `token ${GithubPersonnalToken}`}
        })
            .then(res => res.json())
            .then(res =>
                id = res.number
            )
    } catch (e) {console.log(e)};

   return id;
}

/**
 *  This function updates an issue in Github Issues 
 */
const updateGitIssues = async (title: string, body: string, ISSUE_NUMBER: number) => {
    const JSON_DATA = {
        title: `${title}`,
        body: `${body}`,
        labels: [
            "bug"
        ],
        assignees: ["WilliamsiNFINITE"]
    };

    try {
        await fetch(`https://api.github.com/repos/${GithubUser}/${GithubRepo}/issues/${ISSUE_NUMBER}`, {
        method: 'patch',
        body:    JSON.stringify(JSON_DATA),
        headers: {'Content-Type': 'application/json', 'Authorization': `token ${GithubPersonnalToken}`}
    })
        .then(res =>  res.json())
    } catch (e) {console.log(e)};
}

/**
 *  This function closes an issue in Github Issues 
 */
const closeGitIssues = async (ISSUE_NUMBER: number) => {
    // First API Call to lock the issue conversation
    const JSON_LOCK_DATA = {
        lock_reason : 'resolved'
    };

    try {
        await fetch(`https://api.github.com/repos/${GithubUser}/${GithubRepo}/issues/${ISSUE_NUMBER}/lock`, {
        method:  'put',
        body:   JSON.stringify(JSON_LOCK_DATA),
        headers: {'Accept': 'application/vnd.github+json', 'Authorization': `token ${GithubPersonnalToken}`}
    })
    .then(function(res) {
        return res.text()
    })
    } catch (e) {console.log(e)};

    // Second API Call to close the issue
    const JSON_CLOSE_DATA = {
        state: 'closed'
    };

    try {
        await fetch(`https://api.github.com/repos/${GithubUser}/${GithubRepo}/issues/${ISSUE_NUMBER}`, {
        method: 'patch',
        body:    JSON.stringify(JSON_CLOSE_DATA),
        headers: {'Content-Type': 'application/json', 'Authorization': `token ${GithubPersonnalToken}`}
    })
        .then(res =>  res.json())
    } catch (e) {console.log(e)};
}

/**
 *  This function re-opens an issue in Github Issues 
 */
const reopenGitIssues = async (ISSUE_NUMBER: number) => {
    // First API Call to unlock the issue conversation
    try {
        await fetch(`https://api.github.com/repos/${GithubUser}/${GithubRepo}/issues/${ISSUE_NUMBER}/lock`, {
        method: 'delete',
        headers: {'Content-Type': 'application/vnd.github+json', 'Authorization': `token ${GithubPersonnalToken}`}
    })
        .then(res =>  res.json())
        .then(res => console.log(res))
    } catch (e) {console.log(e)};
    // Second API Call to re-open the issue
    const JSON_OPEN_DATA = {
        state: 'open'
    };

    try {
        await fetch(`https://api.github.com/repos/${GithubUser}/${GithubRepo}/issues/${ISSUE_NUMBER}`, {
        method: 'patch',
        body:    JSON.stringify(JSON_OPEN_DATA),
        headers: {'Content-Type': 'application/json', 'Authorization': `token ${GithubPersonnalToken}`}
    })
        .then(res =>  res.json())
    } catch (e) {console.log(e)};   
}

/**
 *  This function assigns an issue to a specified user in Github Issues 
 *  The user must have permissions on the repository.
 */
const assignGitIssues = async (ISSUE_NUMBER: number, assignees: string[]) => {
    const JSON_DATA = {
        assignees: assignees,
    };

    try {
        await fetch(`https://api.github.com/repos/${GithubUser}/${GithubRepo}/issues/${ISSUE_NUMBER}`, {
        method: 'patch',
        body:    JSON.stringify(JSON_DATA),
        headers: {'Content-Type': 'application/json', 'Authorization': `token ${GithubPersonnalToken}`}
    })
        .then(res =>  res.json())
        .then(res => console.log(res))
    } catch (e) {console.log(e)};
}

export { createGitIssues };
export { updateGitIssues };
export { closeGitIssues };
export { reopenGitIssues };
export { assignGitIssues };