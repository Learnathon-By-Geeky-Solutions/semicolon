export enum Role {
    Admin = "admin",
    Authority = "authority",
    Volunteer = "volunteer",
    User = "user"
}

export enum Permission {

    // admin
    ManageAuthorities = "manage_authorities",

    // authorities
    ManageShelters = "manage_shelters",
    ManageResources = "manage_resources",
    ManageVolunteers = "manage_volunteers",
    
    // user
    ViewShelters = "view_shelters",
    NavigateShelters = "navigate_shelters",
    ViewResources = "view_resources",
    ViewDisasterHeatmap = "view_disaster_heatmap",
}

export const RolePermissions: Record<Role, Permission[]> = {
    [Role.Admin]: [
        Permission.ManageAuthorities,

        Permission.ManageShelters,
        Permission.ManageResources,
        Permission.ManageVolunteers,

        Permission.ViewShelters,
        Permission.NavigateShelters,
        Permission.ViewResources,
        Permission.ViewDisasterHeatmap,
    ],
    [Role.Authority]: [
        Permission.ManageShelters,
        Permission.ManageResources,
        Permission.ManageVolunteers,

        Permission.ViewShelters,
        Permission.NavigateShelters,
        Permission.ViewResources,
        Permission.ViewDisasterHeatmap,
    ],
    [Role.Volunteer]: [
        Permission.ViewShelters,
        Permission.NavigateShelters,
        Permission.ViewResources, // can be asigned more permissions by the authorities
        Permission.ViewDisasterHeatmap,
    ],
    [Role.User]: [
        Permission.ViewShelters,
        Permission.NavigateShelters,
        Permission.ViewResources,
        Permission.ViewDisasterHeatmap,
    ]
};
