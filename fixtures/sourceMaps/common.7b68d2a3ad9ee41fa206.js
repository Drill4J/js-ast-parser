(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{UCte:function(n,t,i){"use strict";i.d(t,"a",function(){return r});var l=i("CcnG"),e=i("Phjn"),o=i("xMyE"),u=i("F/XL"),r=function(){function n(n,t,i){this.profilesService=n,this.router=t,this.userService=i,this.toggle=new l.m,this.isSubmitting=!1}return n.prototype.toggleFollowing=function(){var n=this;this.isSubmitting=!0,this.userService.isAuthenticated.pipe(Object(e.a)(function(t){return t?n.profile.following?n.profilesService.unfollow(n.profile.username).pipe(Object(o.a)(function(t){n.isSubmitting=!1,n.toggle.emit(!1)},function(t){return n.isSubmitting=!1})):n.profilesService.follow(n.profile.username).pipe(Object(o.a)(function(t){n.isSubmitting=!1,n.toggle.emit(!0)},function(t){return n.isSubmitting=!1})):(n.router.navigateByUrl("/login"),Object(u.a)(null))})).subscribe()},n}()},XBA4:function(n,t,i){"use strict";i.d(t,"a",function(){return o}),i.d(t,"b",function(){return u});var l=i("CcnG"),e=i("Ip0R"),o=(i("UCte"),i("YOe5"),i("ZYCi"),i("f4AX"),l.nb({encapsulation:2,styles:[],data:{}}));function u(n){return l.Ib(0,[(n()(),l.pb(0,0,null,null,4,"button",[["class","btn btn-sm action-btn"]],null,[[null,"click"]],function(n,t,i){var l=!0;return"click"===t&&(l=!1!==n.component.toggleFollowing()&&l),l},null,null)),l.ob(1,278528,null,0,e.i,[l.s,l.t,l.k,l.D],{klass:[0,"klass"],ngClass:[1,"ngClass"]},null),l.Bb(2,{disabled:0,"btn-outline-secondary":1,"btn-secondary":2}),(n()(),l.pb(3,0,null,null,0,"i",[["class","ion-plus-round"]],null,null,null,null,null)),(n()(),l.Gb(4,null,[" \xa0 "," ","\n"]))],function(n,t){var i=t.component,l=n(t,2,0,i.isSubmitting,!i.profile.following,i.profile.following);n(t,1,0,"btn btn-sm action-btn",l)},function(n,t){var i=t.component;n(t,4,0,i.profile.following?"Unfollow":"Follow",i.profile.username)})}},ey9i:function(n,t,i){"use strict";i("pKmL"),i("qc5V"),i("X6P6");var l=i("ecC8");i("HatX"),i("Rs8g"),i("YOe5"),i("uOqR"),i("f4AX"),i("C5T1"),i.d(t,"a",function(){return l.a})}}]);
//# sourceMappingURL=common.7b68d2a3ad9ee41fa206.js.map