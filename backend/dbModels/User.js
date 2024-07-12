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
    const random = Math.random();
    let sum = this.preferences.tech;
    if (random < sum) {
        return "tech";
    }
    sum += this.preferences.art;
    if (random < sum) {
        return "art";
    }
    sum += this.preferences.wellness;
    if (random < sum) {
        return "wellness"
    }
    return "sports";
}

export const User = mongoose.model("User", userSchema);