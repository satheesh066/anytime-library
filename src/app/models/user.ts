export class User {
    public Id: string;
    public Name: string;
    public Role: string;
    public FavoriteGenres: string[];
    public Picture!: string;
    public SocialId: string;
    public Friends!: string;

    constructor(id: string, name: string, role: string, favoriteGenres: string[],
        picture: string, socialId: string, friends: string) {
        this.Id = id;
        this.Name = name;
        this.Role = role;
        this.FavoriteGenres = favoriteGenres;
        this.SocialId = socialId;
    }
}
