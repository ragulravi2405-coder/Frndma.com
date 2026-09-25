/**
 * 10 Male Cartoon Character Avatars
 * Users can pick any of these 10 character faces for their profile picture with 1 click.
 * You can also change or customize any seed, style, or avatar URL below.
 */

export interface MaleAvatar {
  id: string;
  name: string;
  tag: string;
  url: string;
}

export const MALE_CARTOON_AVATARS: MaleAvatar[] = [
  {
    id: 'male-hero-alex',
    name: 'Hero Alex',
    tag: 'Adventurer',
    url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Alex&skinColor=ecad80&backgroundColor=b6e3f4',
  },
  {
    id: 'male-smart-vikram',
    name: 'Smart Vikram',
    tag: 'Stylish Beard',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Vikram&facialHair=beardMedium&backgroundColor=ffd5dc',
  },
  {
    id: 'male-cyber-ryan',
    name: 'Cyber Ryan',
    tag: 'Cool Gamer',
    url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Ryan&backgroundColor=d1d4f9',
  },
  {
    id: 'male-jack-glasses',
    name: 'Jack Specs',
    tag: 'Smart Glasses',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jack&glasses=prescription02&backgroundColor=c0aede',
  },
  {
    id: 'male-rockstar-leo',
    name: 'Rockstar Leo',
    tag: 'Anime Cool',
    url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Leo&backgroundColor=ffdfbf',
  },
  {
    id: 'male-urban-adrian',
    name: 'Urban Adrian',
    tag: 'Street Cap',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Adrian&top=hat&backgroundColor=b6e3f4',
  },
  {
    id: 'male-gentleman-david',
    name: 'Gentleman David',
    tag: 'Classic Beard',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David&facialHair=beardMajestic&backgroundColor=ffd5dc',
  },
  {
    id: 'male-samurai-jin',
    name: 'Samurai Jin',
    tag: 'Anime Warrior',
    url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Jin&backgroundColor=d1d4f9',
  },
  {
    id: 'male-athlete-chris',
    name: 'Athlete Chris',
    tag: 'Sporty Guy',
    url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Chris&backgroundColor=c0aede',
  },
  {
    id: 'male-chill-oliver',
    name: 'Chill Oliver',
    tag: 'Winter Beanie',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Oliver&top=winterHat02&backgroundColor=ffdfbf',
  },
];
