import mongoose from "mongoose";
import bcrypt from 'bcrypt';

const weightsSchema = mongoose.Schema(
    {
        tech: {
            type: Number,
            required: true
        },
        art: {
            type: Number,
            required: true
        },
        wellness: {
            type: Number,
            required: true
        },
        sports: {
            type: Number,
            required: true
        }
    },
    { _id: false }
)

const userSchema = mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true    
        },
        password: {
            type: String,
            required: true
        },
        preferences: {
            type: weightsSchema,
            required: true,
            default: {
                tech: 0.25,
                art: 0.25,
                wellness: 0.25,
                sports: 0.25
            }
        }
    }
)

userSchema.set('toJSON', {
    transform: function (doc, ret) {
      delete ret.password;
      return ret;
    }
  });

userSchema.pre("save", function(next) {
    if (!this.isModified('password')) {
        next();
    }
    
    bcrypt.hash(this.password, 12)
        .then(hash => {
            this.password = hash;
            next();
        })
        .catch(err => {
            next(err);
        });
})

userSchema.methods.comparePassword = function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
}

userSchema.methods.selectFocusWeighted = function() {
    const preferences = this.preferences.toObject();
    const random = Math.random();
    let sum = 0;

    for (let key in preferences) {
        sum += preferences[key];

        if (random < sum) {
            return key;
        }
    }

    return "sports";
}

userSchema.methods.updateLiked = function(focus) {
    const factors = {
        tech: { increase: "tech", decrease: ["art", "wellness", "sports"] },
        art: { increase: "art", decrease: ["tech", "wellness", "sports"] },
        wellness: { increase: "wellness", decrease: ["tech", "art", "sports"] },
        sports: { increase: "sports", decrease: ["tech", "art", "wellness"] }
    };

    if (factors[focus]) {
        this.preferences[factors[focus].increase] *= 1.06;
        factors[focus].decrease.forEach(pref => {
            this.preferences[pref] /= 1.02;
        });
    }

    return this.save();
}

userSchema.methods.updateDisliked = function(focus) {
    const factors = {
        tech: { decrease: "tech", increase: ["art", "wellness", "sports"] },
        art: { decrease: "art", increase: ["tech", "wellness", "sports"] },
        wellness: { decrease: "wellness", increase: ["tech", "art", "sports"] },
        sports: { decrease: "sports", increase: ["tech", "art", "wellness"] }
    };

    if (factors[focus]) {
        this.preferences[factors[focus].decrease] /= 1.06;
        factors[focus].increase.forEach(pref => {
            this.preferences[pref] *= 1.02;
        });
    }

    return this.save();
}

export const User = mongoose.model("User", userSchema);